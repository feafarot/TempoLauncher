import { escapeRegExp } from 'shared/utils';
import { FileIndexerService, fileIndexer } from './files-indexer-service';
import { FileInfo } from 'main/storage/cache';
import { TextMatch } from 'shared/utils/util-types';

function optimizeMathces(matches: TextMatch[]) {
  return matches.reduce<TextMatch[]>(
    (s, [cStart, cEnd]) => {
      if (s.length > 0) {
        const [start, end] = s[s.length - 1];
        if (end + 1 == cStart) {
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
          let match = crx.exec(processingValue);
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

function getFuzzyMatches(query: string, value: string) {
  const uppercaseMathces = getUpperCaseNotationMatches(query, value);
  if (uppercaseMathces.length > 0) {
    return uppercaseMathces;
  }

  const regex = new RegExp(escapeRegExp(query), 'gi');
  const result: [number, number][] = [];

  let match: RegExpExecArray | null = null;
  while (match = regex.exec(value)) {
    result.push([match.index, regex.lastIndex - 1]);
  }

  return result;
}

interface SearchMatch {
  fileInfo: FileInfo;
  matches: [number, number][];
}

export class FileSearchService {
  constructor(private filesIndex: FileIndexerService) { }

  async search(query: string) {
    return (await this.filesIndex.getFiles())
      .map<SearchMatch>(x => {
        const matches = getFuzzyMatches(query, x.fileName);
        return {
          fileInfo: x,
          matches: matches
        };
      })
      .filter(x => x.matches.length > 0);
  }
}

export const fileSearchService = new FileSearchService(fileIndexer);
