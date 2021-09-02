/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const Seo = ({ title, description, lang, meta, note }) => {
	// the note graphql is in: gatsby-theme-andy/src/templates/note.js
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						author
						url
						image
						twitter
						keywords
						gaid
					}
				}
			}
		`
	);

	const siteTitle = site.siteMetadata?.title;
	const siteAuthor = site.siteMetadata?.author;
	const siteUrl = site.siteMetadata?.url;
	const siteKeywords = site.siteMetadata?.keywords;
	const twitterHandle = site.siteMetadata?.twitter;
	const GAID = site.siteMetadata?.gaid;
	const noteInfo = note.childMdx.frontmatter;
	const noteTitle = noteInfo.title;
	const image = (noteInfo.image === undefined || noteInfo.image === null) ? site.siteMetadata?.image : noteInfo.image;
	description = (noteInfo.description === undefined || noteInfo.description === null) ? site.siteMetadata?.description : noteInfo.description;
	title = `${noteTitle} | ${siteTitle}`;
	meta = [{ name: `keywords`, content: siteKeywords, }];

	return (
		<Helmet
			htmlAttributes={{ lang, }}
			title={noteTitle}
			titleTemplate={noteTitle ? `%s | ${siteTitle}` : null}
			meta={[
				{ name: `description`, content: description, },
				{ property: `og:title`, content: title, },
				{ property: `og:locale`, content: "en_US", },
				{ property: `og:site_name`, content: siteTitle, },
				{ property: `og:image`, content: image, },
				{ property: `og:type`, content: `article`, },
				{ property: `og:description`, content: description, },
				{ property: `og:url`, content: siteUrl+note.slug, },
				{ property: `article:published_time`, content: noteInfo.date, },
				{ property: `article:author`, content: siteAuthor, },
				{ property: `article:section`, content: "Journal", },
				{ property: `article:tag`, content: ["Journal", "Essay"], },
				{ name: `twitter:card`, content: `summary`, },
				{ name: `twitter:title`, content: title, },
				{ name: `twitter:description`, content: description, },
				{ name: `twitter:image`, content: image, },
				{ name: `twitter:url`, content: siteUrl+note.slug, },
				{ name: `twitter:site`, content: twitterHandle, },
				{ name: `twitter:creator`, content: twitterHandle, },
			].concat(meta)}
		>
			<script async src={`https://www.googletagmanager.com/gtag/js?id=${GAID}`} />
			<script>
				{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${GAID}');
				`}
			</script>
		</Helmet>
	);
};

Seo.defaultProps = {
	lang: `en`,
	meta: [],
	description: ``,
};

Seo.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.string.isRequired,
};

export default Seo;
