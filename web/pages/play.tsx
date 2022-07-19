import {useCallback, useEffect, useState} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {MESSAGE_ENUM, decode, encode, GameState} from "utils";
import {Button, LinearProgress, Typography} from "@mui/material";
import { useStore } from "../src/store";
import { NextSeo } from "next-seo";
import { GetServerSideProps } from "next";
import {getUserProps} from "../src/userProps";


function IndexPage() {
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);

  const { user_info } = useStore((store) => ({
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
            setGameState(msg.data);
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
          type: MESSAGE_ENUM.PLAYER_CLICK,
          data: Date.now(),
        })
      ),
    [sendMessage]
  );

  if (!user_info) {
    return <>
      <Typography>You need to be logged in.</Typography>
    </>
  }

  if (!gameState)
    return <></>

  return (
    <>
      <NextSeo title="AniClicker" />
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user_info.username}!
      </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          You have {gameState?.coin ?? 0} coins.
        </Typography>
      <LinearProgress sx={{my: 3}} variant="determinate" color="success" value={gameState.health > 0 ? Math.max(1, gameState.health / gameState.max_health * 100) : 0} />
      <Button
        color="success"
        variant="contained"
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Attack
      </Button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    ...(await getUserProps(context)),
  }
}

export default IndexPage;
