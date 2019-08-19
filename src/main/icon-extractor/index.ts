import { spawn, exec, execFile } from 'child_process';
import path from 'path';
import { app } from 'electron';
import { Observable } from 'rxjs';
import { EOL } from 'os';

export function extractIcons(paths: string[]) {
  const toolPath = path.resolve(app.getAppPath(), '../../', 'src/icon-extarctor-tool/bin/Release/netcoreapp2.2/win10-x64/IconExtarctor.exe');
  const cmd = `"${toolPath}" ${paths.map(x => `"${x}"`).join(' ')}`;
  const res = new Promise<string[]>((resolve, reject) => {
    exec(cmd, (err, stdout) => {
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
