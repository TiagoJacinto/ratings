import localforage from 'localforage';

export const SQLiteDbFileHandle = {
  get: async () => {
    const dbFileHandle = await localforage.getItem<FileSystemFileHandle>('sqliteDbFileHandle');

    if (!dbFileHandle) return null;

    const hasPermission = (await dbFileHandle.queryPermission()) === 'granted';

    if (!hasPermission) return null;

    return dbFileHandle;
  },
  set: (sqliteDbFileHandle: FileSystemFileHandle) =>
    localforage.setItem('sqliteDbFileHandle', sqliteDbFileHandle),
};
