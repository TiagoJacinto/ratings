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
