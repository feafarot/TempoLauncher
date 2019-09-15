import { SearchMatch } from './search-service';
import { cache } from 'main/storage';
import { AppCacheStorage } from 'main/storage/cache';
import { orderBy } from 'lodash';

function now() {
  return new Date().getTime();
}

export class ScoringService {
  constructor(private appCache: AppCacheStorage) {}

  logLaunch(id: string) {
    const stats = this.appCache.get('launchStats');
    const currentStat = stats[id] || { launchCount: 0 };

    currentStat.launchCount++;
    currentStat.lastLaunchDate = now();

    this.appCache.set(
      'launchStats',
      {
        ...stats,
        [id]: currentStat
      });
  }

  private getBaseScore(searchMatch: SearchMatch) {
    const [fm,] = searchMatch.matches;
    let score = searchMatch.matches.length;
    if (fm[0] === 0) { // If match starts at 0 then increase score by match length
      score += fm[1] + 1;
    }

    return score;
  }

  sortResults(results: SearchMatch[]) {
    const stats = this.appCache.get('launchStats');
    const ids = Object.keys(stats);
    const sortedIds = orderBy(ids, x => stats[x].lastLaunchDate, 'desc');
    const getLaunchScore = (x: SearchMatch) => {
      const launchStat = stats[x.id];
      if (!launchStat) {
        return 0;
      }

      const idIndex = sortedIds.indexOf(x.id);
      return (launchStat.launchCount || 0) * 1000 + idIndex * 10;
    };

    const scored = results.map(x => ({
      score: this.getBaseScore(x) + getLaunchScore(x),
      result: x
    }));
    const sorted = orderBy(scored, x => x.score, 'desc');
    return sorted.map(x => x.result);
  }
}

export const scoringService = new ScoringService(cache);
