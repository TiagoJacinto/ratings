import { useMutation } from '@tanstack/react-query';
import { type Database, type SqlValue } from 'sql.js';
import localforage from 'localforage';

import { useStorage, useStorageType } from '@/components/context/StorageProvider';
import { SQL } from '@/database/load-db';

import { StoragePreferencesForm } from './form.view';

export function PreferencesPage() {
  const orm = useStorage();
  const [currentStorageType, setCurrentStorageType] = useStorageType();

  const { isPending, mutate } = useMutation({
    mutationFn: async (
      values:
        | {
            migrationStrategy: 'use-target' | 'merge' | 'overwrite';
            newStorageType: 'decide-later';
          }
        | {
            migrationStrategy: 'use-target' | 'merge' | 'overwrite';
            newStorageType: 'sqlite';
            sqliteDbFileHandle: FileSystemFileHandle;
          },
    ) => {
      if (!currentStorageType) return;

      async function mergeToTargetDb(targetDb: Database) {
        const tables: { name: string }[] = await orm.sql`
          SELECT name FROM sqlite_master
          WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        `;

        for (const { name: tableName } of tables) {
          const schema: { sql: string }[] = await orm.sql`
            SELECT sql FROM sqlite_master 
            WHERE type = 'table' AND name = ${tableName}
          `;

          const tableSchema = schema[0];
          if (!tableSchema) continue;

          const toSafeCreateTableSQL = (sql: string) =>
            sql.toUpperCase().startsWith('CREATE TABLE IF NOT EXISTS')
              ? sql
              : sql.replace(/^CREATE TABLE/i, 'CREATE TABLE IF NOT EXISTS');

          targetDb.run(toSafeCreateTableSQL(tableSchema.sql));

          const rows: Record<string, SqlValue>[] = await orm.query(`SELECT * FROM ${tableName}`);

          if (rows.length === 0) continue;

          for (const row of rows) delete row.id;

          const columns = Object.keys(rows[0]!);
          const placeholders = columns.map(() => '?').join(',');
          const insertStmt = targetDb.prepare(
            `INSERT OR IGNORE INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`,
          );

          for (const row of rows) {
            insertStmt.run(Object.values(row));
          }

          insertStmt.free();
        }

        return targetDb.export();
      }

      try {
        if (
          currentStorageType === 'decide-later' &&
          values.newStorageType === 'sqlite' &&
          values.migrationStrategy === 'merge'
        ) {
          const targetFile = await values.sqliteDbFileHandle.getFile();
          const targetBuffer = await targetFile.arrayBuffer();
          const targetDb = new SQL.Database(new Uint8Array(targetBuffer));

          const mergedDb = await mergeToTargetDb(targetDb);

          const writable = await values.sqliteDbFileHandle.createWritable();
          await writable.write(mergedDb);
          await writable.close();
        }

        if (
          currentStorageType === 'decide-later' &&
          values.newStorageType === 'sqlite' &&
          values.migrationStrategy === 'overwrite'
        ) {
          const currentDbContent = await localforage.getItem<string>('db');
          if (!currentDbContent) throw new Error('No database found');

          const writable = await values.sqliteDbFileHandle.createWritable();
          await writable.write(currentDbContent);
          await writable.close();
        }

        if (
          currentStorageType === 'sqlite' &&
          values.newStorageType === 'decide-later' &&
          values.migrationStrategy === 'merge'
        ) {
          const targetDbContent = await localforage.getItem<string>('db');
          if (!targetDbContent) throw new Error('No database found');
          const targetDb = new SQL.Database(new Uint8Array(JSON.parse(targetDbContent)));

          const mergedDb = await mergeToTargetDb(targetDb);

          await localforage.setItem('db', JSON.stringify(Array.from(mergedDb)));
        }

        if (
          currentStorageType === 'sqlite' &&
          values.newStorageType === 'decide-later' &&
          values.migrationStrategy === 'overwrite'
        ) {
          const currentDbContent = orm.sqljsManager.exportDatabase();
          await localforage.setItem('db', JSON.stringify(Array.from(currentDbContent)));
        }

        setCurrentStorageType(values.newStorageType);
      } catch (error) {
        console.error('Failed to change storage:', error);
      }
    },
  });

  return (
    <div className='mx-auto w-full max-w-4xl p-4 sm:p-6'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl font-bold sm:text-3xl'>Application Preferences</h1>
        <p className='text-muted-foreground mt-2 text-sm sm:text-base'>
          Manage your application settings and storage configuration
        </p>
      </div>
      <StoragePreferencesForm
        isSubmitting={isPending}
        handleSubmit={(data) => mutate(data)}
        currentStorageType={currentStorageType}
      />
    </div>
  );
}
