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

  {
    const weight1 = new Weight({
      name: 'Weight 1',
      value: 50,
    });

    await dataSource.manager.save(weight1);

    const weight2 = new Weight({
      name: 'Weight 2',
      value: 10,
    });
    await dataSource.manager.save(weight2);

    const weight3 = new Weight({
      name: 'Weight 3',
      value: 40,
    });
    await dataSource.manager.save(weight3);

    const rating = new Rating({
      name: 'Rating 1',
      weights: [weight1, weight2, weight3],
    });
    await dataSource.manager.save(rating);
  }

  return {
    orm: dataSource,
    async clear() {
      const writable = await dbFileHandle.createWritable();
      await writable.write('');
      await writable.close();
    },
  };
}
