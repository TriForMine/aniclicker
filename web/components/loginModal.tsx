import React from "react";
import {Box, Modal, Tab, Tabs, Typography} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import IconButton from "@mui/material/IconButton";
import {LoginForm} from "./loginForm";
import {RegisterForm} from "./registerForm";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export function LoginModal() {
	const [value, setValue] = React.useState(0);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<IconButton
				size="large"
				aria-label="login/register button"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				color="inherit"
				onClick={handleOpen}
			>
				<LoginIcon />
			</IconButton>
			<Modal
				open={open}
				onClose={handleClose}
			>
				<Box sx={{ bgcolor: 'background.paper', width: '100%', maxWidth: '500px', top: '50%', left: '50%', position: 'absolute' as 'absolute', boxShadow: 4, p: 5, transform: 'translate(-50%, -50%)', }}>
					<Tabs value={value} onChange={handleChange} aria-label="Login/Register" variant="fullWidth">
						<Tab label="Login" {...a11yProps(0)} />
						<Tab label="Register" {...a11yProps(1)} />
					</Tabs>
					<TabPanel value={value} index={0}>
						<LoginForm onSuccess={handleClose} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<RegisterForm onSuccess={handleClose} />
					</TabPanel>
				</Box>
			</Modal>
		</>
	)
}
