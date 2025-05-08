import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';
import { DataSource } from 'typeorm';

import { Rating } from './entities/Rating';
import { Weight } from './entities/Weight';

export async function loadDb(dbFileHandle: FileSystemFileHandle) {
  const dbFile = await dbFileHandle.getFile();

  const SQL = await initSqlJs({ locateFile: () => wasm });

  const dataSource = new DataSource({
    autoSave: true,
    database: new Uint8Array(await dbFile.arrayBuffer()),
    driver: SQL,
    entities: [Rating, Weight],
    logging: false,
    synchronize: true,
    type: 'sqljs',
    async autoSaveCallback() {
      const hasPermission = (await dbFileHandle.requestPermission()) === 'granted';

      if (!hasPermission) return;

      const writable = await dbFileHandle.createWritable();
      const dbContent = dataSource.sqljsManager.exportDatabase();

      if (dbContent.length > 0) await writable.write(dbContent);
      await writable.close();
    },
  });

  await dataSource.initialize();

  return {
    orm: dataSource,
    async clear() {
      const writable = await dbFileHandle.createWritable();
      await writable.write('');
      await writable.close();
    },
  };
}
