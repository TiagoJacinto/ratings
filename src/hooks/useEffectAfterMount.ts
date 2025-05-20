import { useEffect, useRef } from 'react';

export const useEffectAfterMount = (effect: () => void, deps?: readonly unknown[]) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) effect();
    else isMounted.current = true;
  }, deps);
};
