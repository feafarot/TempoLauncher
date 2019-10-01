const chr: CheerioAPI = require('cheerio');
import { RequestPromiseAPI } from 'request-promise-native';
const request: RequestPromiseAPI = require('request-promise-native');
const fs = require('fs');
const path = require('path');

async function grabData() {
  const html = await request('https://docs.microsoft.com/en-us/windows/win32/shell/controlpanel-canonical-names');
  const $ = chr.load(html);
  const cpe = $('#main > ul:nth-child(12)')
    .find('a')
    .map((i, e) => chr(e).attr('href')).get()
    .map((x, i) => {
      const name = $(x).text();
      if (i === 0) {
        // console.log(`${x} + ul`);
        // console.log($(`${x} + ul`).html());
      }
      const canonicalName = $(`${x} + ul li:nth-child(1)`).text().replace(/.*: (.*)\n?/, '$1');
      const guid = $(`${x} + ul li:nth-child(2)`).text().replace(/.*: {(.*)}\n?/, '$1');
      const module = $(`${x} + ul li:nth-child(4)`).text().replace(/.*: @(.*)\n?/, '$1');
      return {
        name,
        canonicalName,
        guid,
        module
      };
    });

  fs.writeFileSync(path.resolve(__dirname, 'control-panel-entries.json'), JSON.stringify(cpe, null, 2));

  console.log('Done.');
}

grabData();
