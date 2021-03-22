import { useEffect, useRef } from "react";

function useMouse(key, cb) {
    const callbackRef = useRef(cb);

    useEffect(() => {
        callbackRef.current = cb;
    });

    useEffect(() => {
        function handle(event) {
            callbackRef.current(event);
        }
        document.addEventListener(key, handle);
        return () => document.removeEventListener(key, handle);
    }, []);
}
export default useMouse;
