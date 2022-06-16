import {useCallback, useEffect} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {MESSAGE_ENUM, decode, encode} from "utils";
import {Button, Typography} from "@mui/material";
import {login, profile} from "../src/auth";
import api from "../src/api";
import { useStore } from "../src/store";
import {NextSeo} from "next-seo";
import React from 'react';

function IndexPage() {
    const access_token = useStore((state) => state.access_token)
    const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://localhost:9001`);

    useEffect(() => {
        if (lastMessage !== null) {
            (lastMessage.data as Blob).arrayBuffer().then((data) => {
                let msg = decode(new Uint8Array(data));
                switch (msg.type) {
                    case MESSAGE_ENUM.CLIENT_UPDATE:
                        console.log(`Update`, msg.data);
                        break;
                    case MESSAGE_ENUM.CLIENT_MESSAGE:
                        console.log(`${msg.data.sender} says: ${msg.data.content}`);
                        break;
                    case MESSAGE_ENUM.CLIENT_CONNECTED:
                        console.log(`${msg.data.username} has joined the chat.`);
                        break;
                    case MESSAGE_ENUM.CLIENT_DISCONNECTED:
                        console.log(`${msg.data.username} has left the chat.`);
                        break;
                    case MESSAGE_ENUM.SELF_CONNECTED:
                        console.log(`You are connected! Your username is ${msg.data.username}`);
                        break;
                    default:
                        console.log("Unknown message type.");
                }
            })
        }
    }, [lastMessage]);

    const handleClickSendMessage = useCallback(() => sendMessage(encode({
        type: MESSAGE_ENUM.CLIENT_MESSAGE,
        data: "Hello world!"
    })), [sendMessage]);

    const handleClickRegister = useCallback(() => api.post('http://localhost:9001/register', {
        username: "TriForMine",
        email: "test@triformine.dev",
        password: "password",
    }), []);

    const handleClickLogin = useCallback(async () => {
        const accessToken = await login("test@triformine.dev", "password")
        if (accessToken)
            useStore.setState({access_token: accessToken})
    }, []);

    const handleClickProfile = useCallback(() => {
        profile(access_token).then((data) => {
            if (data !== false)
                alert(data.data)
        })
    }, [access_token]);

    return <>
        <NextSeo
            title="AniClicker"
        />
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
        <Button
            color="success"
            variant="contained"
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
        >
            Click Me to send &apos;Hello&apos;
        </Button>
        <br/>
        <Button
            color="success"
            variant="contained"
            disabled={!!access_token}
            onClick={handleClickRegister}
        >
            Click Me to Register
        </Button>
        <br/>
        <Button
            color="success"
            variant="contained"
            disabled={!!access_token}
            onClick={handleClickLogin}
        >
            Click Me to Login
        </Button>
        <br/>
        <Button
            color="success"
            variant="contained"
            disabled={!access_token}
            onClick={handleClickProfile}
        >
            Click Me to Get Profile
        </Button>
    </>
}

export default IndexPage
