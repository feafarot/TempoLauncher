import Store, { Options, Schema } from 'electron-store';
import { LocalStorage } from './local-storage-wrapper';

export interface FileInfo {
  fullPath: string;
  dirName: string;
  fileName: string;
  extension: string;
  base64Icon?: string;
}

export interface ResultLaunchStats {
  [id: string]: QuerySpecificLaunchStat[];
}

export interface QuerySpecificLaunchStat {
  query: string;
  stat: ResultItemLaunchStat;
}

export interface ResultItemLaunchStat {
  launchCount: number;
  /** In milliseconds */
  lastLaunchDate: number;
}

export interface ControlPanelItemInfo {
  name: string;
  canonicalName: string;
  guid: string;
  base64Icon?: string;
}

export interface WindowLocation {
  x?: number;
  y?: number;
}

export interface AppCacheStore {
  files: FileInfo[];
  launchStats: ResultLaunchStats;
  controlPanelEntries: ControlPanelItemInfo[];
  windowLocation: WindowLocation;
}

export class AppCacheStorage extends LocalStorage<AppCacheStore> {}

const defaultCache: AppCacheStore = {
  files: [],
  launchStats: {},
  controlPanelEntries: [],
  windowLocation: {}
};

const cacheSchema: Schema<AppCacheStore> = {
  files: {
    type: 'array',
    default: defaultCache.files,
    items: {
      type: 'object',
      required: ['fullPath', 'dirName', 'fileName', 'extension'],
      properties: {
        fullPath: { type: 'string' },
        dirName: { type: 'string' },
        fileName: { type: 'string' },
        extension: { type: 'string' },
        base64Icon: { type: 'string' }
      }
    }
  },
  launchStats: {
    type: 'object',
    default: defaultCache.launchStats,
    additionalProperties: {
      type: 'array',
      items: {
        type: 'object',
        required: ['query', 'stat'],
        properties: {
          query: { type: 'string' },
          stat: {
            type: 'object',
            required: ['launchCount', 'lastLaunchDate'],
            properties: {
              launchCount: { type: 'number', minimum: 0 },
              lastLaunchDate: { type: 'number', minimum: 0 }
            }
          }
        }
      }
    }
  },
  controlPanelEntries: {
    type: 'array',
    default: defaultCache.controlPanelEntries,
    items: {
      type: 'object',
      required: ['name', 'canonicalName', 'guid'],
      properties: {
        name: { type: 'string' },
        canonicalName: { type: 'string' },
        guid: { type: 'string' },
        iconPath: { type: 'string' }
      }
    }
  },
  windowLocation: {
    type: 'object',
    properties: {
      x: { type: 'number' },
      y: { type: 'number' }
    }
  }
};

export const cacheStoreOptions: Options<AppCacheStore> = {
  name: '__tl-cache',
  accessPropertiesByDotNotation: false,
  schema: cacheSchema,
  migrations: {
    '0.2.2-beta': store => {
      store.set('launchStats', {});
    }
  },
  clearInvalidConfig: true
};
