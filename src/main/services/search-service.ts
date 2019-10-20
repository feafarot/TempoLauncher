import { TextMatch } from 'shared/utils/util-types';
import { escapeRegExp } from 'shared/utils';
import { DataOperatorFetchOptions, SearchableItem, DataOperatorsRegistry } from 'main/data-operators/data-operator';
import { dataOperatorsRegistry, rebuildAllIndexes } from 'main/data-operators/providers-registry';
import { searchIdHelper } from './search-id-helper';
import { ScoringService, scoringService as defaultScoringService } from './scoring-service';
import { info } from 'electron-log';

function optimizeMathces(matches: TextMatch[]) {
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
    return optimizeMathces(highlightedParts);
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
    return optimizeMathces(highlightedParts);
  }

  return [];
}

function getFuzzyMatches(query: string, value: string) {
  const uppercaseMathces = getUpperCaseNotationMatches(query, value);
  if (uppercaseMathces.length > 0) {
    return uppercaseMathces;
  }

  const abbreviationMathces = getAbbreviationNotationMatches(query, value);
  if (abbreviationMathces.length > 0) {
    return abbreviationMathces;
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
  matches: TextMatch[];
}

export interface SearchOptions {
  dataProviderOptions?: DataOperatorFetchOptions;
}

export class SearchService {
  constructor(private providers: DataOperatorsRegistry, private scoringSvc: ScoringService) { }

  rebuildIndex() {
    info('Rebuilding indicies started.');
    rebuildAllIndexes();
  }

  async search(query: string, options?: SearchOptions) {
    const dataProviderOptions = (options && options.dataProviderOptions) || undefined;
    const resultsCollection = await Promise.all(this.providers.map(x => x.provider.fetch(dataProviderOptions).then(r => ({ provider: x.name, data: r }))));
    const searchResults = resultsCollection
      .flatMap(x => {
        return x.data.map<SearchMatch>(item => {
          const matches = getFuzzyMatches(query, item.displayText);
          return {
            ...item,
            id: searchIdHelper.buildId(x.provider, item.value),
            matches: matches
          };
        });
      })
      .filter(x => x.matches.length > 0);
    return this.scoringSvc.sortResults(searchResults, query);
  }
}

export const searchService = new SearchService(dataOperatorsRegistry, defaultScoringService);
