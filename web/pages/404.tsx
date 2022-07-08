import {Grid, Typography} from "@mui/material";

export default function Custom404() {
	return <Grid height="100vh" container direction="column" alignItems="center">
		<Grid item container display="flex" direction="column" justifyContent="center">
			<Typography component="h1" align="center" variant="h3">404 - Page Not Found</Typography>
		</Grid>
	</Grid>
}
