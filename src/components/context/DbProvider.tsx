import { loadDb } from '@/database/load-db';
import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { type DataSource } from 'typeorm';

type DbContext = {
  orm: DataSource;
  clear(): Promise<void>;
};

const DbContext = React.createContext({} as DbContext);

type Props = Readonly<{
  children: React.ReactNode;
  dbFileHandle: FileSystemFileHandle;
}>;

export function DbProvider({ children, dbFileHandle }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['db'],
    queryFn: () => loadDb(dbFileHandle),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;
  if (!data) return <p>Data not found</p>;

  return <DbContext.Provider value={data}>{children}</DbContext.Provider>;
}

export const useDb = () => useContext(DbContext);
