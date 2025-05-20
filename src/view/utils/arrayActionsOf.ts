export const arrayActionsOf = <T>(array: T[]) => ({
  append: (item: T) => [...array, item],
  prepend: (item: T) => [item, ...array],
  insert: (item: T, index: number) => [...array.slice(0, index), item, ...array.slice(index)],
  remove: (index: number) => [...array.slice(0, index), ...array.slice(index + 1)],
  update: (item: T, index: number) => [...array.slice(0, index), item, ...array.slice(index + 1)],
});
