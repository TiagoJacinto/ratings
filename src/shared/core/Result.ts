import { toPairs } from 'ramda';
import { type UnknownRecord, type Simplify, type ValueOf } from 'type-fest';

export type Ok<T> = {
  value: T;
  isOk: true;
  get unwrapped(): T;
};

export type Err<E> = Readonly<{
  error: E;
  isOk: false;
  get unwrapped(): never;
}>;

export type Result<T, E> = Ok<T> | Err<E>;

export function ok(): Ok<undefined>;
export function ok<T>(value: T): Ok<T>;
export function ok(value?: unknown) {
  return {
    isOk: true,
    value,
    get unwrapped() {
      return value;
    },
  };
}

export function err(): Err<undefined>;
export function err<E>(error: E): Err<E>;
export function err(error?: unknown) {
  return {
    isOk: false,
    error,
    get unwrapped() {
      throw error;
    },
  };
}

export namespace Result {
  type MappedReturnType<T> = {
    [i in keyof T]: T[i] extends () => infer TOk ? TOk : never;
  };

  type MappedOkValues<T> = Simplify<{
    [i in keyof T]: T[i] extends Result<infer TOk, unknown> ? TOk : never;
  }>;

  type GetErrValue<T, TValue extends keyof T = keyof T> =
    ValueOf<T, TValue> extends Result<unknown, infer TErr> ? TErr : never;

  type UnknownResult = Result<unknown, unknown>;
  type TupleOfUnknownResults = readonly UnknownResult[];
  type TupleOfUnknownResultsGetter = readonly (() => UnknownResult)[];
  type RecordOfUnknownResults = Record<PropertyKey, UnknownResult>;
  type RecordOfUnknownResultsGetter = Record<PropertyKey, () => UnknownResult>;

  export function combine<const TResultsTuple extends TupleOfUnknownResults>(
    results: TResultsTuple,
  ): Result<MappedOkValues<TResultsTuple>, GetErrValue<TResultsTuple, number>>;

  export function combine<const TResultsGetterTuple extends TupleOfUnknownResultsGetter>(
    results: TResultsGetterTuple,
  ): Result<
    MappedOkValues<MappedReturnType<TResultsGetterTuple>>,
    GetErrValue<MappedReturnType<TResultsGetterTuple>, number>
  >;

  export function combine<TResultsRecord extends RecordOfUnknownResults>(
    results: TResultsRecord,
  ): Result<MappedOkValues<TResultsRecord>, GetErrValue<TResultsRecord>>;

  export function combine<TResultsGetterRecord extends RecordOfUnknownResultsGetter>(
    results: TResultsGetterRecord,
  ): Result<
    MappedOkValues<MappedReturnType<TResultsGetterRecord>>,
    GetErrValue<MappedReturnType<TResultsGetterRecord>>
  >;

  export function combine(
    results:
      | TupleOfUnknownResults
      | TupleOfUnknownResultsGetter
      | RecordOfUnknownResults
      | RecordOfUnknownResultsGetter,
  ) {
    if (Array.isArray(results)) {
      const unwrappedOkValues = [];

      for (const resultOrGetter of results as TupleOfUnknownResults | TupleOfUnknownResultsGetter) {
        const result = typeof resultOrGetter === 'function' ? resultOrGetter() : resultOrGetter;

        if (!result.isOk) return result;

        unwrappedOkValues.push(result.value);
      }

      return ok(unwrappedOkValues);
    }

    const unwrappedOkValues: UnknownRecord = {};

    for (const [key, resultOrGetter] of toPairs(
      results as RecordOfUnknownResults | RecordOfUnknownResultsGetter,
    )) {
      const result = typeof resultOrGetter === 'function' ? resultOrGetter() : resultOrGetter;

      if (!result.isOk) return result;

      unwrappedOkValues[key] = result.value;
    }

    return ok(unwrappedOkValues);
  }
}
