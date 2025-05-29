import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { useLocalStorage } from 'react-use';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Clock, Database } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type JSX } from 'react';

import { queryClient } from '@/lib/queryClient';
import { type StorageType } from '@/types';

import { StorageProvider } from '../context/StorageProvider';
import { ModulesProvider } from '../context/ModulesProvider';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../atoms/form';
import { RadioCard, RadioCardItem } from '../atoms/radio-card';
import { Button } from '../atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../atoms/card';

export function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <WithStorage>
        <ModulesProvider>
          <Outlet />
        </ModulesProvider>
      </WithStorage>
    </QueryClientProvider>
  );
}

function WithStorage({ children }: Readonly<{ children: JSX.Element }>) {
  const [storageType, setStorageType, removeStorageType] =
    useLocalStorage<StorageType>('storage-type');

  return storageType ? (
    <StorageProvider
      storageType={storageType}
      setStorageType={setStorageType}
      removeStorageType={removeStorageType}
    >
      {children}
    </StorageProvider>
  ) : (
    <ChooseStorage onSubmit={({ storageType }) => setStorageType(storageType)} />
  );
}

const formSchema = z.object({
  storageType: z.enum(['decide-later', 'sqlite']),
});

type FormSchema = z.infer<typeof formSchema>;

function ChooseStorage({
  onSubmit,
}: Readonly<{
  onSubmit: SubmitHandler<FormSchema>;
}>) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const storageType = form.watch('storageType');

  return (
    <div className='flex min-h-screen justify-center bg-gray-50 p-4 pt-16'>
      <div className='w-full max-w-lg'>
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl'>Welcome to Ratings</h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            Before you start creating evaluation categories, please choose how you'd like to store
            your data.
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardHeader className='text-center'>
            <CardTitle className='text-xl sm:text-2xl'>Choose Storage Type</CardTitle>
            <CardDescription className='text-base'>
              Select how you want to store your categories and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='storageType'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioCard
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid gap-4 md:grid-cols-2'
                        >
                          <FormItem>
                            <FormControl>
                              <RadioCardItem value='decide-later'>
                                <div className='rounded-sm bg-blue-100 p-2'>
                                  <Clock className='text-blue-600' />
                                </div>
                                <span className='text-lg font-semibold text-gray-900'>
                                  Decide later
                                </span>
                              </RadioCardItem>
                            </FormControl>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioCardItem value='sqlite'>
                                <div className='rounded-sm bg-blue-100 p-2'>
                                  <Database className='h-6 w-6 text-blue-600' />
                                </div>
                                <span className='text-lg font-semibold text-gray-900'>SQLite</span>
                              </RadioCardItem>
                            </FormControl>
                          </FormItem>
                        </RadioCard>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-center pt-4'>
                  <Button type='submit' className='h-12 w-full min-w-[200px] text-lg sm:w-auto'>
                    {storageType === 'sqlite' ? 'Create Database' : 'Continue'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>
            You can change your storage settings later in the application preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
