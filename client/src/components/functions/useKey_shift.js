import { useEffect, useRef } from "react";

function useKey_shift(key, cb) {
  const callbackRef = useRef(cb);

  useEffect(() => {
      callbackRef.current = cb;
  });

  useEffect(() => {
      function handle(event) {
          if (event.code === key && event.shiftKey) {
              callbackRef.current(event);
          }
      }
      document.addEventListener("keydown", handle);
      return () => document.removeEventListener("keydown", handle);
  }, [key]);
}

export default useKey_shift;