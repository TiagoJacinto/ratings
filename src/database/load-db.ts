import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';
import { type DataSourceOptions, DataSource } from 'typeorm';
import 'localforage';
import localforage from 'localforage';

import { Rating } from './entities/Rating';
import { Weight } from './entities/Weight';
import { AlternativeCategory } from './entities/AlternativeCategory';
import { Alternative } from './entities/Alternative';
import { Criterion } from './entities/Criterion';
import { RatedCriterion } from './entities/RatedCriterion';

export const SQL = await initSqlJs({ locateFile: () => wasm });

export async function loadDb(dbFileHandle?: FileSystemFileHandle) {
  if (!dbFileHandle) window.localforage = localforage;

  const options: DataSourceOptions = {
    autoSave: true,
    driver: SQL,
    entities: [Alternative, AlternativeCategory, Criterion, RatedCriterion, Rating, Weight],
    synchronize: true,
    type: 'sqljs',
  };

  const dataSource = dbFileHandle
    ? new DataSource({
        ...options,
        database: new Uint8Array(await (await dbFileHandle.getFile()).arrayBuffer()),
        autoSaveCallback: async () => {
          const hasPermission = (await dbFileHandle.requestPermission()) === 'granted';
          if (!hasPermission) return;

          const writable = await dbFileHandle.createWritable();
          const dbContent = dataSource.sqljsManager.exportDatabase();

          if (dbContent.length > 0) await writable.write(dbContent);
          await writable.close();
        },
      })
    : new DataSource({
        ...options,
        location: 'db',
        useLocalForage: true,
      });

  await dataSource.initialize();

  return dataSource;
}
