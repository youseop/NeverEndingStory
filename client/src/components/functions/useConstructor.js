import { useState } from "react";

export const useConstructor = (cb) => {
    const [isInited, setInit] = useState(false);
    if (isInited) return;
    cb();
    setInit(true);
}