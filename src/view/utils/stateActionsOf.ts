import { type StateSetter } from '@/shared/view/State';
import { pipe, map } from 'ramda';

export const stateActionsOf = <T, U extends Record<string, (...args: any[]) => T>>(
  value: T,
  setter: StateSetter<T>,
  getActions: (value: T) => U,
) =>
  map((f) => pipe(f, setter), getActions(value)) as {
    [K in keyof U]: (...args: Parameters<U[K]>) => void;
  };
