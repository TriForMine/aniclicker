import { useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MESSAGE_ENUM, decode, encode } from "utils";
import { Button, Typography } from "@mui/material";
import { login, profile, register } from "../src/auth";
import api from "../src/api";
import { initializeStore, useStore } from "../src/store";
import { NextSeo } from "next-seo";
import React from "react";
import { GetServerSideProps } from "next";
import {useRouter} from "next/router";

function IndexPage() {
  const router = useRouter();

  const { access_token, setAccessToken, user_info } = useStore((store) => ({
    access_token: store.access_token,
    user_info: store.user_info,
    setUserInfo: store.setUserInfo,
    setAccessToken: store.setAccessToken,
  }));

  const { sendMessage, lastMessage, readyState } =
    useWebSocket(`ws://localhost:9001`);

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
            console.log(
              `You are connected! Your username is ${msg.data.username}`
            );
            break;
          default:
            console.log("Unknown message type.");
        }
      });
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(
    () =>
      sendMessage(
        encode({
          type: MESSAGE_ENUM.CLIENT_MESSAGE,
          data: "Hello world!",
        })
      ),
    [sendMessage]
  );

  if (!user_info) {
    return <>
      <Typography>You need to be logged in.</Typography>
    </>
  }

  return (
    <>
      <NextSeo title="AniClicker" />
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user_info.username}!
      </Typography>
      <Button
        color="success"
        variant="contained"
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send &apos;Hello&apos;
      </Button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const cookie = req.headers.cookie;
  try {
    const data = await api.post("/refreshToken", null, {
      headers: {
        cookie,
      },
    });

    res.setHeader("Set-Cookie", data.headers["set-cookie"]);

    const userData = await api.get("/profile", {
      headers: {
        authorization: `Bearer ${data.data.accessToken}`,
      },
    });

    const zustandStore = initializeStore();

    zustandStore.getState().setAccessToken(data.data.accessToken);
    zustandStore.getState().setUserInfo(userData.data);

    return {
      props: { initialZustandState: JSON.stringify(zustandStore.getState()) },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
};

export default IndexPage;
