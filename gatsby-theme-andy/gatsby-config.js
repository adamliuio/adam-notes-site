// old gatsby version:
// warn Plugin gatsby-plugin-sitemap is not compatible with your gatsby version 2.24.55 - It requires gatsby@^3.0.0-next.0
// package.json: "gatsby": "^2.24.55",

const path = require("path");

const SiteTitle = "Adam's Brain";
const SiteDescription =
	"I'm Adam, this is a network of my brain. You can find my thoughts, journals here, and you can see that they are interlinked to each other, like nodes on a net, which means that the path you take to explore my thoughts, is very likely that it's unique to you. Isn't it interesting?";
const Author = "Adam Liu";
const SiteUrl = "https://adamliu.io/";
const SiteImage = "https://source.unsplash.com/QL0FAxaq2z0/1600x900";
const TwitterHandle = "@adamliuio";
const SiteKeywords = `Adam Liu, Technology, Ideas, Startup, Life Lessons, Science, Essays, Journals, Thoughts`;
const GoogleAnalyticsID = "G-B89DBSN1Y2";

let notesDirectory = "../../adam-notes-content/";
let notesFileExtensions = [".md", ".mdx"];
let noteTemplate = path.join(__dirname, "src/templates/note.js");
let additionalNoteTypes = {};
let rootPath = "/";
let rootNote = "hi";
let linkifyHashtags = false;
let hideDoubleBrackets = true;
let mdxOtherwiseConfigured = false;
let themeUIOtherwiseConfigured = false;
let generateRSS = false;
let rssPath = "/rss.xml";
let rssTitle = SiteTitle;

module.exports = {
	siteMetadata: {
		title: SiteTitle,
		description: SiteDescription,
		author: Author,
		url: SiteUrl,
		image: SiteImage,
		twitter: TwitterHandle,
		keywords: SiteKeywords,
		gaid: GoogleAnalyticsID,
		siteUrl: SiteUrl,
	},
	plugins: [
		{
			resolve: "gatsby-plugin-robots-txt",
			options: {
				host: SiteUrl,
				sitemap: `${SiteUrl}sitemap.xml`,
				policy: [{ userAgent: "*", allow: "/" }],
			},
		},
		{
			resolve: `gatsby-plugin-sitemap`,
			options: {
				output: `/sitemap.xml`,
			},
		},
		{
			resolve: "../gatsby-theme-brain",
			options: {
				notesDirectory,
				notesFileExtensions,
				noteTemplate,
				additionalNoteTypes,
				rootPath,
				rootNote,
				linkifyHashtags,
				hideDoubleBrackets,
				mdxOtherwiseConfigured,
				generateRSS,
				rssPath,
				rssTitle,
			},
		},
		`gatsby-plugin-robots-txt`,
		`gatsby-plugin-styled-components`,
		!themeUIOtherwiseConfigured && `gatsby-plugin-theme-ui`,
	],
};
