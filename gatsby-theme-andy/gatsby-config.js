const path = require("path");

let notesDirectory = "../content/";
let notesFileExtensions = [".md", ".mdx"];
let noteTemplate = path.join(__dirname, "src/templates/note.js");
let additionalNoteTypes = {};
let rootPath = "/";
let rootNote = "about";
let linkifyHashtags = false;
let hideDoubleBrackets = true;
let mdxOtherwiseConfigured = false;
let themeUIOtherwiseConfigured = false;
let generateRSS = false;
let rssPath = "/rss.xml";
let rssTitle = "My Notes";

module.exports = {
	siteMetadata: {
		title: "Adam's Brain",
	},
	plugins: [
		`gatsby-plugin-styled-components`,
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
		!themeUIOtherwiseConfigured && `gatsby-plugin-theme-ui`,
	],
};
