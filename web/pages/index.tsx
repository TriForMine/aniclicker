import {Typography} from "@mui/material";
import {NextSeo} from "next-seo";
import React from 'react';
function IndexPage() {
    return <>
        <NextSeo
            title="AniClicker"
        />
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
    </>
}

export default IndexPage
