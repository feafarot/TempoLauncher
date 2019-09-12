import { DataOperator, DataOperatorFetchOptions, SearchableItem } from './data-operator';
import { FileIndexerService, fileIndexer } from 'main/services/files-indexer-service';
import { spawn } from 'child_process';

export class FilesDataProvider implements DataOperator {
  constructor(private filesIndexer: FileIndexerService) {}

  async fetch(options?: DataOperatorFetchOptions) {
    const files = await this.filesIndexer.getFiles(options && options.rebuildCache);
    return files.map<SearchableItem>(x => ({
      icon: x.base64Icon,
      displayText: x.fileName,
      value: x.fullPath
    }));
  }

  async launch(value: string) {
    spawn(`"${value}"`, { shell: true });
    return true;
  }
}

export const filesDataProvider = new FilesDataProvider(fileIndexer);
