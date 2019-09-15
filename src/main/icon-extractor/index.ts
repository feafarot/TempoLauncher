import { execFile } from 'child_process';
import path from 'path';
import { app } from 'electron';
import { EOL } from 'os';
import { isDev } from 'main/main-utils';

const MaxCmdArgsLength = 2300;
function getArgumentBatches(paths: string[]) {
  let curretLength = 0;
  let batches: string[][] = [[]];
  let currentBatchIndex = 0;
  for (let i in paths) {
    if (paths[i].length + curretLength < MaxCmdArgsLength) {
      curretLength += paths[i].length;
      batches[currentBatchIndex].push(paths[i]);
    }
    else {
      batches.push([]);
      currentBatchIndex++;
      curretLength = 0;
    }
  }

  return batches;
}

function getToolPaths() {
  let toolPath = path.resolve(process.resourcesPath!, 'tools/icon-extractor');
  if (isDev()) {
    toolPath = path.resolve(app.getAppPath(), '../../', 'src/icon-extarctor-tool/bin/Release/netcoreapp2.2/win10-x64');
  }

  return {
    cwd: toolPath + '',
    exe: 'IconExtarctor.exe'
  };
}

function extractIconsInternal(paths: string[]) {
  const toolPaths = getToolPaths();
  const cmd = `.\\${toolPaths.exe} ${paths.map(x => `"${x}"`).join(' ')}`;
  const res = new Promise<string[]>((resolve, reject) => {
    execFile(`${toolPaths.cwd}/${toolPaths.exe}`, paths, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      const icons = stdout.split(EOL);
      resolve(icons);
    });
  });

  return res;
}

export function extractIcons(paths: string[]) {
  const batches = getArgumentBatches(paths);
  return Promise.all(batches.map(x => extractIconsInternal(x))).then(x => x.flatMap(y => y));
}

// export function extractIcons(paths: string[]) {
//   const toolPath = path.resolve(app.getAppPath(), '../../', 'src/icon-extractor-tool/bin/Release/netcoreapp2.2/win10-x64/IconExtractor.exe');
//   //spawn(toolPath, { argv0: paths.join(' ') });
//   const res = new Observable<string>(obs => {
//     exec(`"${toolPath}" ${paths.map(x => `"${x}"`).join(' ')}`, (err, stdout, stderr) => {
//       const icons = stdout.split(EOL);
//       icons.forEach(x => obs.next(x));
//     });
//   });
//   return res;
// }
