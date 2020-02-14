import { DataOperator, DataOperatorFetchOptions, SearchableItem, GlobalScope } from './data-operator';
import { FileIndexerService, fileIndexer } from 'main/services/files-indexer-service';
import { spawn } from 'child_process';

export class FilesDataOperator implements DataOperator {
  constructor(private filesIndexer: FileIndexerService) {}

  get pluginKey() {
    return 'filesDataOperator';
  }

  get scope() {
    return GlobalScope;
  }

  async rebuildIndex() {
    await this.filesIndexer.indexFiles();
  }

  async fetch(currentQuery?: string, options?: DataOperatorFetchOptions) {
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

export const filesDataOperator = new FilesDataOperator(fileIndexer);
