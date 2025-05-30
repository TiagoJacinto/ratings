import { keys } from 'ramda';
import { type FieldErrors } from 'react-hook-form';

export function once(fn: ((e: Event) => void) | null) {
  return function (e: Event) {
    if (fn) fn(e);
    fn = null;
  };
}

export function preventDefault(fn: (e: SubmitEvent) => void) {
  return (e: SubmitEvent) => {
    e.preventDefault();
    fn(e);
  };
}

export function getFirstInvalidTab<T extends FieldErrors>(
  errors: T,
  fieldTabs: Record<keyof Omit<T, 'root'>, string>,
) {
  const firstError = keys(errors)[0];
  if (!firstError || firstError === 'root') return;

  return fieldTabs[firstError as keyof Omit<T, 'root'>];
}
