/** @jsx jsx */
// import React from 'react';
import { LinkToStacked } from "./CustomLinkToStacked";
import { Link } from "gatsby";
import { jsx } from "theme-ui";

import Tippy from "./Tippy";

const AnchorTag = ({ href, popups = {}, noPopups = false, ...restProps }) => {
	if (!href) href = restProps.to;
	if (!href.match(/^http/))
		return noPopups ? (
			<Link {...restProps} to={href} sx={{ variant: "links.internal" }} />
		) : (
			<Tippy
				content={popups[href.replace(/^\//, "")]}
				placement="right"
				animation="shift-away"
			>
				<span>
					<span style={{ color: "darkgray" }}>[[</span>
					<LinkToStacked {...restProps} to={href} sx={{ variant: "links.internal" }} />
					<span style={{ color: "darkgray" }}>]]</span>
				</span>
			</Tippy>
		);
	/* eslint-disable */
	return <a {...restProps} href={href} target="_blank" />;
	/* eslint-enable */
};

export default {
	a: AnchorTag,
};
