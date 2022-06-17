import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import LoginIcon from '@mui/icons-material/Login';
import Link from "next/link";
import {useStore} from "../src/store";
import shallow from "zustand/shallow";

const pages = [
	{name: 'Home', href: '/'},
	{name: 'Play', href: '/play'},
	{name: 'Leaderboard', href: '/leaderboard'},
	{name: 'Friends', href: '/friends'},
	{name: 'Guilds', href: '/guilds'}
];
export function ReactiveAppBar() {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const { user_info } = useStore((store) => ({
			access_token: store.access_token,
			user_info: store.user_info,
			setUserInfo: store.setUserInfo,
			setAccessToken: store.setAccessToken,
		}),
		shallow)

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<PlusOneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Link passHref href="/">
						<Typography
							variant="h6"
							noWrap
							component="a"
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'Rubik',
								fontWeight: 700,
								letterSpacing: '.2rem',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							AniClicker
						</Typography>
					</Link>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.name} onClick={handleCloseNavMenu}>
									<Link href={page.href}>
										<Typography textAlign="center">{page.name}</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<PlusOneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'Rubik',
							fontWeight: 700,
							letterSpacing: '.2rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						AniClicker
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Link key={page.name} href={page.href}>
								<Button
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									{page.name}
								</Button>
							</Link>
						))}
					</Box>

					{
						user_info ? <Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
									<Avatar>{user_info.username.slice(0, 3)}</Avatar>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{mt: '45px'}}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem key="profile" onClick={handleCloseUserMenu}>
									<Link href="/profile">
										<Typography textAlign="center">Profile</Typography>
									</Link>
								</MenuItem>
								<MenuItem key="settings" onClick={handleCloseUserMenu}>
									<Link href="/settings">
										<Typography textAlign="center">Settings</Typography>
									</Link>
								</MenuItem>
								<MenuItem key="logout" onClick={handleCloseUserMenu}>
									<Typography textAlign="center">Logout</Typography>
								</MenuItem>
							</Menu>
						</Box> : <>
							<Box sx={{ flexGrow: 0 }}>
								<IconButton
									size="large"
									aria-label="login/register button"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									color="inherit"
								>
									<LoginIcon />
								</IconButton>
							</Box>
						</>
					}

				</Toolbar>
			</Container>
		</AppBar>
	);
}
