import {useCallback, useEffect} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {MESSAGE_ENUM, decode, encode} from "utils";
import {Button, Typography} from "@mui/material";
import {login, profile} from "../src/auth";
import api from "../src/api";
import {initializeStore, useStore} from "../src/store";
import {NextSeo} from "next-seo";
import React from 'react';
import {GetServerSideProps} from "next";

function IndexPage() {
    const {access_token, setAccessToken, user_info} = useStore((store) => ({
            access_token: store.access_token,
            user_info: store.user_info,
            setUserInfo: store.setUserInfo,
            setAccessToken: store.setAccessToken,
        }))

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
            setAccessToken(accessToken)
    }, [setAccessToken]);

    const handleClickProfile = useCallback(() => {
        profile(access_token).then((data) => {
            alert(data.data)
        })
    }, [access_token]);

    if (!user_info) {
        return <>
            <NextSeo
                title="AniClicker"
            />
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
        </>
    }

    return <>
        <NextSeo
            title="AniClicker"
        />
        <Typography variant="h4" component="h1" gutterBottom>Welcome, {user_info.username}!</Typography>
        <Button
            color="success"
            variant="contained"
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
        >
            Click Me to send &apos;Hello&apos;
        </Button>
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const cookie = req.headers.cookie;
    try {
        const data = await api.post("/refreshToken", null, {
            headers: {
                cookie
            },
        })

        res.setHeader('Set-Cookie', data.headers['set-cookie']);

        const userData = await api.get("/profile", {
            headers: {
                authorization: `Bearer ${data.data.accessToken}`
            }
        })

        const zustandStore = initializeStore()

        zustandStore.getState().setAccessToken(data.data.accessToken)
        zustandStore.getState().setUserInfo(userData.data)

        return {
            props: {initialZustandState: JSON.stringify(zustandStore.getState())},
        }
    } catch (e) {
        return {
            props: {}
        }
    }
}


export default IndexPage
