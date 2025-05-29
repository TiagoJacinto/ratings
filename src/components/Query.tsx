import { type JSX } from 'react';

import { type Maybe } from '@/shared/core/Maybe';

type Props<TData> = Readonly<
  | {
      checkData?: true;
      data: Maybe<TData>;
      error: unknown;
      isLoading: boolean;
      children: (data: NonNullable<TData>) => JSX.Element;
    }
  | {
      checkData: false;
      data: Maybe<TData>;
      error: unknown;
      isLoading: boolean;
      children: (data: Maybe<TData>) => JSX.Element;
    }
>;

export function Query<TData>({ checkData, children, data, error, isLoading }: Props<TData>) {
  checkData ??= true;

  if (isLoading)
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
          <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
        </div>
      </div>
    );
  if (error) {
    if (import.meta.env.DEV) {
      console.error(error);

      return <p>Error... See the console for details</p>;
    }

    return <p>Error...</p>;
  }
  if (checkData && !data) return <p>Data not found</p>;

  return children(data as NonNullable<TData>);
}
