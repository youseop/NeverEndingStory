import { useEffect, useRef } from "react";

function useKey(key, cb) {
    console.log(key)
    const callbackRef = useRef(cb);

    useEffect(() => {
        callbackRef.current = cb;
    });

    useEffect(() => {
        function handle(event) {
            if (event.code === key && !event.shiftKey) {
                callbackRef.current(event);
            }
        }
        document.addEventListener("keypress", handle);
        return () => document.removeEventListener("keypress", handle);
    }, [key]);
}

export default useKey;