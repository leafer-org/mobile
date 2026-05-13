type Pending = { isPending: boolean };

export function useAnyPending(mutations: ReadonlyArray<Pending>): boolean {
  return mutations.some((m) => m.isPending);
}
