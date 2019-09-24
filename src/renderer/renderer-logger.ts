import { info, error } from 'electron-log';

export function logInfo<T>(msg: T) {
  info(`[R] ${msg}`);
}

export function logError<T>(msg: T) {
  error(`[R] ${msg}`);
}
