import React, { useEffect, useState } from "react";
import { Row, Card, Icon, Avatar, Col, Typography } from "antd";
import Axios from "axios";
import moment from "moment";
import GameDetailPage from "../GameDetailPage/GameDetailPage";

import { socket } from "../../App"

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
    const [messageCount, setMessageCount] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {

        if (inRoom) {
            // console.log('joining room');
            socket.emit('room', { room: 'test-room' });
        }

        return () => {
            if (inRoom) {
                // console.log('leaving room');
                socket.emit('leave room', {
                    room: 'test-room'
                })
            }
        }
    });

    useEffect(() => {
    socket.off("receive message");
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
        // console.log('new theme: ' + newTheme);
        setTheme(newTheme);
    }

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    }

    const handleNewMessage = () => {
        // console.log('emitting new message');
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

export default LandingPage;
