import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { type DataSource } from 'typeorm';
import { ArrowLeft, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { loadDb } from '@/database/load-db';
import { SQLiteDbFileHandle } from '@/resources/SQLiteDbFileHandle';
import { type StorageType } from '@/types';

import { Query } from '../Query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../atoms/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../atoms/form';
import { Button } from '../atoms/button';
import { OpenFilePickerButton } from '../molecules/OpenFilePickerButton';

type Props = Readonly<{
  children: React.ReactNode;
  storageType: StorageType;
  setStorageType: (storageType: StorageType) => void;
  removeStorageType: () => void;
}>;

type StorageTypeContext = {
  storageType: StorageType;
  setStorageType: (storageType: StorageType) => void;
  removeStorageType: () => void;
};

const StorageTypeContext = React.createContext<StorageTypeContext>({} as StorageTypeContext);

export function StorageTypeProvider({
  children,
  removeStorageType,
  setStorageType,
  storageType,
}: Props) {
  return (
    <StorageTypeContext.Provider
      value={{
        removeStorageType,
        setStorageType,
        storageType,
      }}
    >
      {children}
    </StorageTypeContext.Provider>
  );
}

const useStorageType = () => useContext(StorageTypeContext);

export function StorageProvider({ children, storageType, ...props }: Props) {
  return (
    <StorageTypeProvider storageType={storageType} {...props}>
      {(() => {
        if (storageType === 'decide-later' || storageType === 'sqlite')
          return <WithSQLiteDatabase storageType={storageType}>{children}</WithSQLiteDatabase>;
      })()}
    </StorageTypeProvider>
  );
}

function WithSQLiteDatabase({
  children,
  storageType,
}: Readonly<{ children: React.ReactNode; storageType: 'decide-later' | 'sqlite' }>) {
  if (storageType === 'decide-later') return <DbProvider>{children}</DbProvider>;
  if (storageType === 'sqlite') return <WithSQLiteFileDatabase>{children}</WithSQLiteFileDatabase>;
}

function WithSQLiteFileDatabase({ children }: Readonly<{ children: React.ReactNode }>) {
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
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: SQLiteDbFileHandle.set,
    onSuccess: (data) => queryClient.setQueryData(['sqliteDbFileHandle'], data),
  });

  return (
    <SQLiteConfigurationForm
      onSubmit={({ sqliteDbFileHandle }) => mutate(sqliteDbFileHandle)}
      isSubmitting={isPending}
    />
  );
}

const formSchema = z.object({
  sqliteDbFileHandle: z.unknown().refine((value) => value instanceof FileSystemFileHandle, {
    message: 'Please choose a SQLite database',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type SQLiteConfigurationFormProps = Readonly<{
  isSubmitting: boolean;
  onSubmit: (data: FormSchema) => void;
}>;

function SQLiteConfigurationForm({ isSubmitting, onSubmit }: SQLiteConfigurationFormProps) {
  const { removeStorageType } = useStorageType();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className='flex min-h-screen justify-center bg-gray-50 p-4 pt-16'>
      <div className='w-full max-w-lg'>
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl'>Welcome to Ratings</h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            Configure your SQLite database settings.
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardHeader className='text-center'>
            <CardTitle className='flex items-center justify-center gap-2 text-xl sm:text-2xl'>
              <Database className='h-6 w-6 text-blue-600' />
              SQLite Database Configuration
            </CardTitle>
            <CardDescription className='text-base'>
              Set up your local SQLite database for persistent storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='sqliteDbFileHandle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SQLite Database File</FormLabel>
                      <FormControl>
                        <OpenFilePickerButton
                          type='button'
                          handle={field.value}
                          onFileChange={field.onChange}
                          options={{
                            types: [
                              {
                                accept: {
                                  'application/vnd.sqlite3': ['.db', '.sqlite3'],
                                },
                              },
                            ],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-4 pt-4 sm:flex-row'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={removeStorageType}
                    className='flex h-12 w-full items-center justify-center gap-2 sm:w-auto'
                  >
                    <ArrowLeft className='h-4 w-4' />
                    Back
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='h-12 w-full min-w-[200px] flex-1 text-lg sm:w-auto'
                  >
                    {isSubmitting ? (
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                        Creating Database...
                      </div>
                    ) : (
                      'Create Database'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type DbContext = DataSource;
const DbContext = React.createContext({} as DbContext);

function DbProvider({
  children,
  dbFileHandle,
}: Readonly<{ children: React.ReactNode; dbFileHandle?: FileSystemFileHandle }>) {
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

export const useStorage = () => useContext(DbContext);
