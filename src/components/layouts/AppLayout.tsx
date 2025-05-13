import { queryClient } from '@/lib/queryClient';
import { SQLiteDbFileHandle } from '@/resources/SQLiteDbFileHandle';
import { QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import { DbProvider } from '../context/DbProvider';
import { ChooseSQLiteDatabaseForm } from '../sections/ChooseSQLiteDatabaseForm.view';
import { ModulesProvider } from '../context/ModulesProvider';
import { Query } from '../Query';

export function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-full w-full p-4'>
        <WithDatabase>
          <ModulesProvider>
            <Outlet />
          </ModulesProvider>
        </WithDatabase>
      </div>
    </QueryClientProvider>
  );
}

function WithDatabase({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data, error, isLoading } = useQuery({
    queryFn: SQLiteDbFileHandle.get,
    queryKey: ['sqliteDbFileHandle'],
  });

  return (
    <Query checkData={false} isLoading={isLoading} error={error} data={data}>
      {(data) =>
        data ? <DbProvider dbFileHandle={data}>{children}</DbProvider> : <ChooseSQLiteDatabase />
      }
    </Query>
  );
}

function ChooseSQLiteDatabase() {
  const { mutate } = useMutation({
    mutationFn: SQLiteDbFileHandle.set,
    onSuccess: (data) => queryClient.setQueryData(['sqliteDbFileHandle'], data),
  });

  return <ChooseSQLiteDatabaseForm onSubmit={(values) => mutate(values.sqliteDbFileHandle)} />;
}
