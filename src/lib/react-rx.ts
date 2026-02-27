import { useEffect, useRef } from 'react';
import { Subject } from 'rxjs';

export function useSubscribeSubject<T>(subject: Subject<T>, handler: (value: T) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    const subscription = subject.subscribe((value: T) => {
      handlerRef.current(value);
    });
    return () => subscription.unsubscribe();
  }, [subject]);
}
