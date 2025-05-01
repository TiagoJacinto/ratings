import { loadDb } from '@/database/load-db';
import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { type DataSource } from 'typeorm';

type DbContext = Readonly<{
  orm: DataSource;
  clear(): Promise<void>;
}>;

const DbContext = React.createContext({} as DbContext);

type Props = Readonly<{
  children: React.ReactNode;
  dbFileHandle: FileSystemFileHandle;
}>;

export function DbProvider({ children, dbFileHandle }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['db'],
    queryFn: () => loadDb(dbFileHandle),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (import.meta.env.DEV) {
      console.error(error);

      return <p>{error.message}</p>;
    }

    return <p>Error...</p>;
  }
  if (!data) return <p>Data not found</p>;

  return <DbContext.Provider value={data}>{children}</DbContext.Provider>;
}

export const useDb = () => useContext(DbContext);
