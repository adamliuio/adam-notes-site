/** @jsx jsx */
// import React from 'react';
import { jsx, Box } from "theme-ui";

import ReferredBlock from "./ReferredBlock";

const Footer = ({ references }) => {
	return (
		<Box p={3} sx={{ borderRadius: 2 }} mb={2} bg="accent" color="text-light">
			<ReferredBlock references={references} />
			<Box>
				<p sx={{ m: 0, fontSize: 1 }}>Do not go gentle into that good night,</p>
				<p sx={{ m: 0, fontSize: 1 }}>Old age should burn and rave at close of day;</p>
				<p sx={{ m: 0, fontSize: 1 }}>Rage, rage against the dying of the light.</p>
			</Box>
		</Box>
	);
};

export default Footer;
