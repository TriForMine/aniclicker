import {Divider, Typography} from "@mui/material";
import {NextSeo} from "next-seo";
import React from 'react';
import {RegisterForm} from "../components/registerForm";
import {LoginForm} from "../components/loginForm";
function IndexPage() {
    return <>
        <NextSeo
            title="AniClicker"
        />
        <RegisterForm />
        <Divider sx={{my: 3}} />
        <LoginForm />
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
    </>
}

export default IndexPage
