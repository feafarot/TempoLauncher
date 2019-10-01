import { execFile } from 'child_process';
import path from 'path';
import { app } from 'electron';
import { EOL } from 'os';
import { isDev } from 'main/main-utils';

const fileNotFoundIconResponse = '--FNF--';
const MaxCmdArgsLength = 2300;

function getArgumentBatches(paths: string[]) {
  let curretLength = 0;
  let batches: string[][] = [[]];
  let currentBatchIndex = 0;
  for (let i in paths) {
    if (paths[i].length + curretLength < MaxCmdArgsLength) {
      curretLength += paths[i].length;
      batches[currentBatchIndex].push(paths[i]);
    } else {
      batches.push([paths[i]]);
      currentBatchIndex++;
      curretLength = paths[i].length;
    }
  }

  return batches;
}

function getToolPaths() {
  let toolPath = path.resolve(process.resourcesPath!, 'tools/icon-extractor');
  if (isDev()) {
    toolPath = path.resolve(app.getAppPath(), '../../', 'src/icon-extarctor-tool/bin/Release/netcoreapp3.0/win-x64/publish');
  }

  return {
    cwd: toolPath + '',
    exe: 'IconExtarctor.exe'
  };
}

function extractIconsInternal(paths: string[]) {
  const toolPaths = getToolPaths();
  const res = new Promise<string[]>((resolve, reject) => {
    execFile(`${toolPaths.cwd}/${toolPaths.exe}`, paths, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      const icons = stdout.trimEnd().split(EOL);
      resolve(icons);
    });
  });

  return res;
}

export function extractIcons(paths: string[]) {
  const batches = getArgumentBatches(paths);
  return Promise.all(batches.map(x => extractIconsInternal(x)))
    .then(x => x.flatMap(y => y).map(icon => icon === fileNotFoundIconResponse ? null : icon));
}
