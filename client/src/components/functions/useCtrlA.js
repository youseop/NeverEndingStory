// import { useEffect, useRef } from "react";

// function useCtrlA(cb) {
//     const callbackRef = useRef(cb);

//     useEffect(() => {
//         callbackRef.current = cb;
//     });

//     useEffect(() => {
//         function handle(event) {
//             console.log(event.code)
//             console.log(event.ctrlKey)
//             if (event.code === 65 && event.ctrlKey) {
//                 callbackRef.current(event);
//             }
//         }
//         document.addEventListener("keypress", handle);
//         return () => document.removeEventListener("keypress", handle);
//     }, []);
// }


// export default useCtrlA;