import { DataOperator, DataOperatorFetchOptions, SearchableItem } from './data-operator';
import { spawn } from 'child_process';
import { getStaticImageAsBase64 } from 'main/main-utils';

const defaultIcon = getStaticImageAsBase64('cmd-96.png');

function createStartCmd(execTarget?: string, shell: string = 'cmd /K') {
  return `start ${shell} ${execTarget || ''}`;
}

export class CmdDataOperator implements DataOperator {
  constructor() {}

  get pluginKey() {
    return 'cmdDataOperator';
  }

  get scope() {
    return 'cmd';
  }

  get defaultItem(): SearchableItem {
    return {
      displayText: this.scope,
      value: this.pluginKey,
      icon: defaultIcon,
      secondaryText: 'Plugin to quickly run "cmd" and "powershell" commands.'
    };
  }

  async fetch(currentQuery?: string, options?: DataOperatorFetchOptions): Promise<SearchableItem[]> {
    return [
      {
        displayText: 'CMD',
        value: createStartCmd(currentQuery),
        icon: defaultIcon,
        secondaryText: `cmd> "${currentQuery}"`
      },
      {
        displayText: 'PowerShell',
        value: createStartCmd(`"${currentQuery}"`, 'PowerShell -Command'),
        icon: defaultIcon,
        secondaryText: `PS> "${currentQuery}"`
      },
      // {
      //   displayText: 'PowerShell as Administrator',
      //   value: `powershell -Command "Start-Process PowerShell \\"-ExecutionPolicy Bypass -NoProfile -NoExit -Command \`\\"${currentQuery}\\"\`\\" -Verb RunAs`,
      //   icon: defaultIcon,
      //   secondaryText: `[Admin] PS> "${currentQuery}"`
      // }
    ];
  }

  async launch(value: string, query?: string): Promise<boolean> {
    if (value == this.pluginKey) {
      return false;
    }

    spawn(value, { shell: true, detached: true });
    return true;
  }
}

export const defaultCmdDataOperator = new CmdDataOperator();
