import localforage from 'localforage';

export async function getSQLiteDbFileHandle() {
  const dbFileHandle = await localforage.getItem<FileSystemFileHandle>('sqliteDbFileHandle');

  if (!dbFileHandle) return null;

  const hasPermission = (await dbFileHandle.queryPermission()) === 'granted';

  if (!hasPermission) return null;

  return dbFileHandle;
}
