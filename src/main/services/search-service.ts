import { TextMatch } from 'shared/utils/util-types';
import { escapeRegExp } from 'shared/utils';
import { DataOperatorFetchOptions, SearchableItem, DataOperatorsRegistry } from 'main/data-operators/data-operator';
import { dataOperatorsRegistry, rebuildAllIndexes } from 'main/data-operators/providers-registry';
import { searchIdHelper } from './search-id-helper';
import { ScoringService, scoringService as defaultScoringService } from './scoring-service';
import { info } from 'electron-log';
import { AppCacheStorage } from 'main/storage/cache';
import { cache } from 'main/storage';
import { SearchQuery } from 'shared/contracts/search';

function optimizeMatches(matches: TextMatch[]) {
  return matches.reduce<TextMatch[]>(
    (s, [cStart, cEnd]) => {
      if (s.length > 0) {
        const [start, end] = s[s.length - 1];
        if (end + 1 === cStart) {
          s[s.length - 1] = [start, cEnd];
          return s;
        }
      }

      s.push([cStart, cEnd]);
      return s;
    },
    []);
}

function getUpperCaseNotationMatches(query: string, value: string) {
  const queryChars = query.split('').map(x => escapeRegExp(x).toUpperCase());
  const asUpperCaseMather = new RegExp(queryChars.join('.*'), 'g');
  if (asUpperCaseMather.test(value)) {
    let processingValue = value;
    let baseIndex = 0;
    const highlightedParts = queryChars
      .map(x => new RegExp(x, 'g'))
      .reduce<TextMatch[]>(
        (s, crx) => {
          const match = crx.exec(processingValue);
          s.push([baseIndex + match!.index, baseIndex + match!.index]);
          processingValue = processingValue.substr(match!.index + 1);
          baseIndex += match!.index + 1;
          return s;
        },
        []);
    return optimizeMatches(highlightedParts);
  }

  return [];
}

function getAbbreviationNotationMatches(query: string, value: string) {
  const queryChars = query.split('').map(x => `(^|\\s)${x}`);
  const asUpperCaseMather = new RegExp(queryChars.join('.*'), 'gi');
  if (asUpperCaseMather.test(value)) {
    let processingValue = value;
    let baseIndex = 0;
    const highlightedParts = queryChars
      .map(x => new RegExp(x, 'gi'))
      .reduce<TextMatch[]>(
        (s, crx) => {
          const match = crx.exec(processingValue);
          if (!match) {
            return s;
          }

          const relativeIndex = match![0].length > 1 ? match!.index + 1: match!.index;
          s.push([baseIndex + relativeIndex, baseIndex + relativeIndex]);
          processingValue = processingValue.substr(relativeIndex + 1);
          baseIndex += relativeIndex + 1;
          return s;
        },
        []);
    return optimizeMatches(highlightedParts);
  }

  return [];
}

function getFuzzyMatches(query: string, value: string) {
  const uppercaseMatches = getUpperCaseNotationMatches(query, value);
  if (uppercaseMatches.length > 0) {
    return uppercaseMatches;
  }

  const abbreviationMatches = getAbbreviationNotationMatches(query, value);
  if (abbreviationMatches.length > 0) {
    return abbreviationMatches;
  }

  const regex = new RegExp(escapeRegExp(query), 'gi');
  const result: TextMatch[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(value))) {
    result.push([match.index, regex.lastIndex - 1]);
  }

  return result;
}

export interface SearchMatch extends SearchableItem {
  id: string;
  isPluginSelector?: boolean;
  matches: TextMatch[];
}

export interface SearchOptions {
  dataProviderOptions?: DataOperatorFetchOptions;
}

export class SearchService {
  constructor(private providers: DataOperatorsRegistry, private scoringSvc: ScoringService, private appCache: AppCacheStorage) { }

  private get globalProviders() {
    return this.providers.filter(x => x.isGlobal);
  }

  private get providedSearchableItems() {
    return this.providers
      .filter(x => x.operator.defaultItem != null)
      .map(x => ({ provider: x.name, data: [x.operator.defaultItem!], isPluginSelector: true }));
  }

  async rebuildIndex() {
    info('Rebuild index started.');
    this.appCache.set('files', []);
    await rebuildAllIndexes();
    info('Rebuild index finished.');
  }

  private async getGlobalSearchMatches(query: string, options?: DataOperatorFetchOptions) {
    const resultsCollection = await Promise.all(
      this.globalProviders.map(x => x.operator.fetch(query, options)
        .then(r => ({ provider: x.name, data: r, isPluginSelector: false }))));
    const searchResults =resultsCollection.concat(this.providedSearchableItems)
      .flatMap(x => {
        return x.data.map<SearchMatch>(item => {
          const matches = getFuzzyMatches(query, item.displayText);
          return {
            ...item,
            id: searchIdHelper.buildId(x.provider, item.value),
            matches: matches,
            isPluginSelector: x.isPluginSelector
          };
        });
      })
      .filter(x => x.matches.length > 0);
    return searchResults;
  }

  private async getPluginSearchMatches(query: string, pluginKey: string, options?: DataOperatorFetchOptions) {
    const plugin = this.providers.find(x => !x.isGlobal && x.name === pluginKey)!;
    const pluginResults = await plugin.operator.fetch(query, options);
    return pluginResults.map<SearchMatch>(x => ({
      ...x,
      id: searchIdHelper.buildId(plugin.name, x.value),
      matches: [],
    }));
  }

  async search(queryObj: SearchQuery, options?: SearchOptions) {
    if (queryObj.query == '') {
      return [];
    }

    const dataProviderOptions = (options && options.dataProviderOptions) || undefined;
    const searchResults = queryObj.pluginKey
      ? await this.getPluginSearchMatches(queryObj.query, queryObj.pluginKey, dataProviderOptions)
      : await this.getGlobalSearchMatches(queryObj.query, dataProviderOptions);
    return this.scoringSvc.sortResults(searchResults, queryObj.query);
  }
}

export const searchService = new SearchService(dataOperatorsRegistry, defaultScoringService, cache);
