import { Container } from "@mui/material";
import { NextPage } from "next";

/**
 * A page that displays success in the middle.
 */
const Success: NextPage = () => {
	return <Container style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
		<h1>Success</h1>
	</Container>
}

export default Success;