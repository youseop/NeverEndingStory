import { useEffect, useRef } from "react";
import { message } from "antd";

function useKey(key, cb) {
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