import { type JSX } from 'react';

type Props<TData> = Readonly<
  | {
      checkData?: true;
      data: TData | undefined;
      error: unknown;
      isLoading: boolean;
      children: (data: TData) => JSX.Element;
    }
  | {
      checkData: false;
      data: TData | undefined;
      error: unknown;
      isLoading: boolean;
      children: (data: TData | undefined) => JSX.Element;
    }
>;

export function Query<TData>({ checkData, children, data, error, isLoading }: Props<TData>) {
  checkData ??= true;

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (import.meta.env.DEV) {
      console.error(error);

      return <p>Error... See the console for details</p>;
    }

    return <p>Error...</p>;
  }
  if (checkData && !data) return <p>Data not found</p>;

  return children(data as TData);
}
