import { loadDb } from '@/database/load-db';
import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { type DataSource } from 'typeorm';

import { Query } from '../Query';

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

  return (
    <Query isLoading={isLoading} error={error} data={data}>
      {(data) => <DbContext.Provider value={data}>{children}</DbContext.Provider>}
    </Query>
  );
}

export const useDb = () => useContext(DbContext);
