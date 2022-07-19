import {Typography} from "@mui/material";
import {NextSeo} from "next-seo";
import React from 'react';
import {GetServerSideProps} from "next";
import {getUserProps} from "../src/userProps";
function IndexPage() {
    return <>
        <NextSeo
            title="AniClicker"
        />
        <Typography variant="h4" component="h1" gutterBottom>Hello Next.js 👋</Typography>
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        ...(await getUserProps(context)),
    }
}

export default IndexPage
