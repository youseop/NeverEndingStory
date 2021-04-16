import React, { useEffect, useState } from "react";
import useKey from "../../functions/useKey";
import { useWindupString } from "windups";
import useMouse from "../../functions/useMouse";
import { LOCAL_HOST } from "../../Config";
const config = require("../../../config/key")


// const voice = new Audio(`${config.STORAGE}/uploads/TYPING.mp3`);
// voice.volume = 0.8
function TextAnimation({ cut_script, setIsTyping, muted }) {
    const [flag, setFlag] = useState(false);
    let i = 0;
    // muted ? voice.muted = true : voice.muted = false;
    const [text, { skip }] = useWindupString(
        cut_script,
        {
            pace: () => 50,
            onFinished: () => {
                // if (voice)
                //     voice.pause()
                setFlag(true)
            },
            // onChar: () => {
            //     if ((i == 0 || cut_script[i] === ' ' || cut_script[i] === '.')) {
            //         if (voice)
            //             voice.pause()
            //     } else {
            //         if (voice)
            //             voice.play()
            //     }
            //     i++;
            // }
        }
    );

    useKey("Enter", handleEnter);
    useKey("Space", handleEnter);
    useMouse("mouseup", handleEnter);
    function handleEnter(event) {
        skip()
    }

    useEffect(() => {
        return () => {
            setIsTyping(false)
        }
    }, [flag])

    if (cut_script)
        return <div>{text}</div>
    else
        return <div></div>
}


export default TextAnimation;