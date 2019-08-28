import { createHash } from 'crypto';

export function getHash(data: string) {
  return createHash('md5').update(data).digest('hex');
}
