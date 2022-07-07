import {Typography} from "@mui/material";
import {NextSeo} from "next-seo";
import React from 'react';
import {RegisterForm} from "../components/registerForm";
function IndexPage() {
    return <>
        <NextSeo
            title="AniClicker"
        />
        <RegisterForm/>
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
    </>
}

export default IndexPage
