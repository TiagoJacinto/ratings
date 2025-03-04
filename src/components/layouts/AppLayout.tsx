import { queryClient } from '@/lib/queryClient';
import { getSQLiteDbFileHandle } from '@/queries/getSQLiteDbFileHandle';
import { QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import localforage from 'localforage';
import { Outlet } from 'react-router';

import { DbProvider } from '../context/DbProvider';
import { ChooseSQLiteDatabase } from '../sections/ChooseSQLiteDatabase.view';

export function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-full w-full p-4'>
        <WithDatabase>
          <Outlet />
        </WithDatabase>
      </div>
    </QueryClientProvider>
  );
}

function WithDatabase({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sqliteDbFileHandle'],
    queryFn: getSQLiteDbFileHandle,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return data ? (
    <DbProvider dbFileHandle={data}>{children}</DbProvider>
  ) : (
    <ChooseSQLiteDatabaseContainer />
  );
}

function ChooseSQLiteDatabaseContainer() {
  const { mutate } = useMutation({
    mutationKey: ['addSqliteDbFileHandle'],
    mutationFn: (sqliteDbFileHandle: FileSystemFileHandle) =>
      localforage.setItem('sqliteDbFileHandle', sqliteDbFileHandle),
    onSuccess: (data) => queryClient.setQueryData(['sqliteDbFileHandle'], data),
  });

  return <ChooseSQLiteDatabase onSubmit={(values) => mutate(values.sqliteDbFileHandle)} />;
}
