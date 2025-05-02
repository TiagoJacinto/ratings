import { type JSX } from 'react';

type Props<TData> = Readonly<{
  data: TData | undefined;
  error: unknown;
  isLoading: boolean;
  children: (data: TData) => JSX.Element;
}>;

export function Query<TData>({ children, data, error, isLoading }: Props<TData>) {
  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (import.meta.env.DEV) {
      console.error(error);

      return <p>Error... See the console for details</p>;
    }

    return <p>Error...</p>;
  }
  if (!data) return <p>Data not found</p>;

  return children(data);
}
