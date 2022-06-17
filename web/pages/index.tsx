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
import shallow from "zustand/shallow";
import axios from "axios";
function IndexPage() {
    return <>
        <NextSeo
            title="AniClicker"
        />
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
    </>
}

export default IndexPage
