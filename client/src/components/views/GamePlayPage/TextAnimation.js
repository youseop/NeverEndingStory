import React, { useEffect, useState } from "react";
import useKey from "../../functions/useKey";
import { useWindupString } from "windups";
import useMouse from "../../functions/useMouse";
import { LOCAL_HOST } from "../../Config";

// const voice = new Audio('http://localhost:5000/uploads/sfx-blipmale.wav')
// const voice = new Audio(`http://${LOCAL_HOST}:5000/uploads/sfx-typwriter.wav`)
// voice.volume = 0.8
function TextAnimation({ cut_script, setIsTyping }) {
    const [flag, setFlag] = useState(false);
    let i = 0;
    const [text, { skip }] = useWindupString(
        cut_script,
        {
            pace: () => 150,
            onFinished: () => {
                setFlag(true)
            },
            // onChar: () => {
            //     if (!(cut_script[i] === ' ' || cut_script[i] === '.')) {
            //         voice.load()
            //         voice.play()
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