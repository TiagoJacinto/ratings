import { queryClient } from '@/lib/queryClient';
import { SQLiteDbFileHandle } from '@/resources/SQLiteDbFileHandle';
import { QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import { DbProvider } from '../context/DbProvider';
import { ChooseSQLiteDatabaseForm } from '../sections/ChooseSQLiteDatabaseForm.view';

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
  const { data, isError, isLoading } = useQuery({
    queryFn: SQLiteDbFileHandle.get,
    queryKey: ['sqliteDbFileHandle'],
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return data ? <DbProvider dbFileHandle={data}>{children}</DbProvider> : <ChooseSQLiteDatabase />;
}

function ChooseSQLiteDatabase() {
  const { mutate } = useMutation({
    mutationFn: SQLiteDbFileHandle.set,
    onSuccess: (data) => queryClient.setQueryData(['sqliteDbFileHandle'], data),
  });

  return <ChooseSQLiteDatabaseForm onSubmit={(values) => mutate(values.sqliteDbFileHandle)} />;
}
