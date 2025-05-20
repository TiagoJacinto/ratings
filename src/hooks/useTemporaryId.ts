import { useRef } from 'react';

export function useTemporaryId() {
  const id = useRef(0);

  return () => --id.current;
}
