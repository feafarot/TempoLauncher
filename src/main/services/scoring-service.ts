import { SearchMatch } from './search-service';
import { cache } from 'main/storage';
import { AppCacheStorage, ResultLaunchStats, QuerySpecificLaunchStat } from 'main/storage/cache';
import { orderBy, maxBy, max } from 'lodash';

function now() {
  return new Date().getTime();
}

function normalizeQuery(query: string) {
  return query.toLowerCase().trim();
}

/** Where ['query exists score', 'query not exists score', 'date scrore'] */
type SortScore = [number, number, number];

type LaunchScore = {
  fullMatchQueryLaunchScore: number;
  noQueryMatchLaunchScore: number;
  launchDateScore: number;
};

export class ScoringService {
  constructor(private appCache: AppCacheStorage) {}

  logLaunch(id: string, query: string) {
    const normalizedQuery = normalizeQuery(query);
    const stats = this.appCache.get('launchStats');
    const currentIdStats = (stats[id] || []).concat();
    const currentStatIndex = currentIdStats.findIndex(x => x.query === normalizedQuery);
    const currentStat = currentIdStats[currentStatIndex] || { query: normalizedQuery, stat: { launchCount: 0, lastLaunchDate: 0 } };
    currentStat.stat.launchCount++;
    currentStat.stat.lastLaunchDate = now();

    this.appCache.set(
      'launchStats',
      {
        ...stats,
        [id]: currentStatIndex < 0 ? [...currentIdStats, currentStat] : currentIdStats
      });
  }

  private getBaseScore(searchMatch: SearchMatch, query: string) {
    const [fm,] = searchMatch.matches;
    let score = searchMatch.matches.reduce((s, c) => s + c[1] - c[0] + 1, 0); // Total lengths of matches
    if (fm[1] - fm[0] === query.length - 1) { // Full match
      return 1000000;
    }

    if (fm[0] === 0) { // If match starts at 0 then increase score by (match length) * 100
      score += (fm[1] + 1) * 100;
    }

    return score;
  }

  private createScoringFn(stats: ResultLaunchStats, normalizedQuery: string) {
    const getLaunchScore = (sm: SearchMatch): LaunchScore => {
      const idStats = stats[sm.id];
      if (!idStats) {
        return {
          fullMatchQueryLaunchScore: 0,
          noQueryMatchLaunchScore: 0,
          launchDateScore: 0
        };
      }

      // const queryStat = idStats.find(x => x.query === normalizedQuery);
      // const noMatchScore = idStats.reduce((s, c) => s + c.stat.launchCount, 0);
      const res = idStats.reduce(
        (s, c) => {
          if (c.query === normalizedQuery) {
            s.matchedQueryLaunches = c.stat.launchCount;
          }

          s.totalLaunches = idStats.reduce((pc, cc) => pc + cc.stat.launchCount, 0);
          s.maxDate = max([s.maxDate, c.stat.lastLaunchDate])!;
          return s;
        },
        {
          matchedQueryLaunches: 0,
          totalLaunches: 0,
          maxDate: 0
        });

      return {
        noQueryMatchLaunchScore: res.totalLaunches,
        fullMatchQueryLaunchScore: res.matchedQueryLaunches,
        launchDateScore: res.maxDate
      };
    };
    return getLaunchScore;
  }

  sortResults(results: SearchMatch[], query: string) {
    const normalizedQuery = normalizeQuery(query);
    const stats = this.appCache.get('launchStats');
    const getLaunchScore = this.createScoringFn(stats, normalizedQuery);

    const scored = results.map(x => ({
      ...getLaunchScore(x),
      baseScore: this.getBaseScore(x, normalizedQuery),
      result: x
    }));
    const sorted = orderBy(
      scored,
      [x => x.fullMatchQueryLaunchScore, x => x.noQueryMatchLaunchScore, x => x.launchDateScore, x => x.baseScore],
      ['desc', 'desc', 'desc', 'desc']
    );
    return sorted.map(x => x.result);
  }
}

export const scoringService = new ScoringService(cache);
