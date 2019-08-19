import { globby } from 'shared/utils/import-normalize';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { extractIcons } from 'main/icon-extractor';
import path from 'path';

async function indexFolders(patterns: string[]) {
  const files = await globby(patterns);
  const icons = await extractIcons(files);
  return files.map((x, i) => ({
    file: x,
    name: path.basename(x),
    icon: icons[i]
  }));
}

export async function search() {
  const controlTools = 'C:/ProgramData/Microsoft/Windows/Start Menu/Programs/Administrative Tools/*.{exe,lnk}';
  return await indexFolders([controlTools]);
}
