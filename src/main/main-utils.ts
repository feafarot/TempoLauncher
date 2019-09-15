import { createHash } from 'crypto';

export function getHash(data: string) {
  return createHash('md5').update(data).digest('hex');
}

export function isDev() {
  return process.env.NODE_ENV !== 'production';
}
