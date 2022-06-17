import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import '@fontsource/rubik'
import {Box, Container, useMediaQuery} from "@mui/material";
import {TokenState, Provider, useCreateStore} from "../src/store";
import {ReactiveAppBar} from "../components/appbar";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
	initialZustandState?: TokenState;
}

export default function MyApp(props: MyAppProps) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
				},
			}),
		[prefersDarkMode],
	);

	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	return (
		<Provider createStore={useCreateStore(props.pageProps.initialZustandState)}>
			<CacheProvider value={emotionCache}>
				<Head>
					<meta name="viewport" content="initial-scale=1, width=device-width" />
					<link rel="apple-touch-icon-precomposed" sizes="57x57" href="https://www.aniclicker.com/apple-touch-icon-57x57.png" />
					<link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://www.aniclicker.com/apple-touch-icon-114x114.png" />
					<link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://www.aniclicker.com/apple-touch-icon-72x72.png" />
					<link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://www.aniclicker.com/apple-touch-icon-144x144.png" />
					<link rel="apple-touch-icon-precomposed" sizes="60x60" href="https://www.aniclicker.com/apple-touch-icon-60x60.png" />
					<link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://www.aniclicker.com/apple-touch-icon-120x120.png" />
					<link rel="apple-touch-icon-precomposed" sizes="76x76" href="https://www.aniclicker.com/apple-touch-icon-76x76.png" />
					<link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://www.aniclicker.com/apple-touch-icon-152x152.png" />
					<link rel="icon" type="image/png" href="https://www.aniclicker.com/favicon-196x196.png" sizes="196x196" />
					<link rel="icon" type="image/png" href="https://www.aniclicker.com/favicon-96x96.png" sizes="96x96" />
					<link rel="icon" type="image/png" href="https://www.aniclicker.com/favicon-32x32.png" sizes="32x32" />
					<link rel="icon" type="image/png" href="https://www.aniclicker.com/favicon-16x16.png" sizes="16x16" />
					<link rel="icon" type="image/png" href="https://www.aniclicker.com/favicon-128.png" sizes="128x128" />
					<meta name="application-name" content="AniClicker"/>
					<meta name="msapplication-TileColor" content="#FFFFFF" />
					<meta name="msapplication-TileImage" content="https://www.aniclicker.com/mstile-144x144.png" />
					<meta name="msapplication-square70x70logo" content="https://www.aniclicker.com/mstile-70x70.png" />
					<meta name="msapplication-square150x150logo" content="https://www.aniclicker.com/mstile-150x150.png" />
					<meta name="msapplication-wide310x150logo" content="https://www.aniclicker.com/mstile-310x150.png" />
					<meta name="msapplication-square310x310logo" content="https://www.aniclicker.com/mstile-310x310.png" />
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<ReactiveAppBar />
					<Container maxWidth="sm">
						<Box sx={{ my: 4 }}>
							<Component {...pageProps} />
						</Box>
					</Container>
				</ThemeProvider>
			</CacheProvider>
		</Provider>
	);
}
