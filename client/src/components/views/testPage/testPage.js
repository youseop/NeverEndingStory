import { Col, List, message, Row } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../App"

function TestPage(props) {
    const [messageCount, setMessageCount] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {

        if (inRoom) {
            socket.emit('room', { room: 'test-room' });
        }

        return () => {
            if (inRoom) {
                socket.emit('leave room', {
                    room: 'test-room'
                })
            }
        }
    });

    useEffect(() => {
        socket.off("receive message")
        socket.on('receive message', payload => {
            setMessageCount(messageCount + 1);
            document.title = `${messageCount} new messages have been emitted`;
        });
    }, []); //only re-run the effect if new message comes in

    const handleSetTheme = () => {
        let newTheme;
        (theme === 'light')
            ? newTheme = 'dark'
            : newTheme = 'light';
        setTheme(newTheme);
    }

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    }

    const handleNewMessage = () => {
        socket.emit('new message', {
            room: 'test-room'
        });
        setMessageCount(messageCount + 1);
    }

    return (
        <div className={`App Theme-${theme}`}>
            <header className="App-header">

                <h1>
                    {inRoom && `You Have Entered The Room`}
                    {!inRoom && `Outside Room`}
                </h1>

                <p>{messageCount} messages have been emitted</p>

                {inRoom &&
                    <button onClick={() => handleNewMessage()}>
                        Emit new message
          </button>
                }

                <button onClick={() => handleSetTheme()}>
                    Toggle Theme
          </button>

                <button onClick={() => handleInRoom()}>
                    {inRoom && `Leave Room`}
                    {!inRoom && `Enter Room`}
                </button>

            </header>
        </div>
    );
}

export default TestPage;
