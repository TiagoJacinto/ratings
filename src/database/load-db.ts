import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';
import { DataSource } from 'typeorm';
import 'localforage';
import localforage from 'localforage';

import { Rating } from './entities/Rating';
import { Weight } from './entities/Weight';
import { AlternativeCategory } from './entities/AlternativeCategory';
import { Alternative } from './entities/Alternative';
import { Criterion } from './entities/Criterion';
import { RatedCriterion } from './entities/RatedCriterion';

export async function loadDb(dbFileHandle?: FileSystemFileHandle) {
  const SQL = await initSqlJs({ locateFile: () => wasm });

  if (!dbFileHandle) window.localforage = localforage;

  const dataSource = dbFileHandle
    ? new DataSource({
        autoSave: true,
        database: new Uint8Array(await (await dbFileHandle.getFile()).arrayBuffer()),
        driver: SQL,
        entities: [Alternative, AlternativeCategory, Criterion, RatedCriterion, Rating, Weight],
        location: dbFileHandle ? undefined : 'db',
        logging: false,
        subscribers: [],
        synchronize: true,
        type: 'sqljs',
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
        autoSave: true,
        driver: SQL,
        entities: [Alternative, AlternativeCategory, Criterion, RatedCriterion, Rating, Weight],
        location: 'db',
        logging: false,
        subscribers: [],
        synchronize: true,
        type: 'sqljs',
        useLocalForage: true,
      });

  await dataSource.initialize();

  return dataSource;
}
