const matter = require("gray-matter");
const unified = require("unified");
const markdown = require("remark-parse");
const stringifyMd = require("remark-stringify");
const textNoEscaping = require("./text-no-escaping");
const findDeepestChildForPosition = require("./find-eepest-child-for-position");

function processMarkdownNotes(markdownNotes, pluginOptions, externalMapsParsed) {
	let slugToNoteMap = new Map();
	let nameToSlugMap = new Map();
	let allReferences = [];

	const additionalNoteTypes = pluginOptions.additionalNoteTypes || {};

	markdownNotes.forEach(({ slug, fullPath, rawFile }) => {
		let fileContents = matter(rawFile);
		let content = fileContents.content;
		let frontmatter = fileContents.data;
		var tree = unified().use(markdown).parse(content);

		let title = slug;
		nameToSlugMap[slug] = slug;

		if (frontmatter.title != null) {
			title = frontmatter.title;
			nameToSlugMap[frontmatter.title.toLowerCase()] = slug;
		}

		let aliases = [];
		if (frontmatter.aliases != null) {
			aliases = frontmatter.aliases;
			frontmatter.aliases
				.map((a) => a.toLowerCase())
				.forEach((alias) => {
					nameToSlugMap[alias] = slug;
				});
		}

		let noteTemplate = pluginOptions.noteTemplate || "./templates/brain.js";
		noteTemplate = require.resolve(noteTemplate);
		if (frontmatter.noteType != null) {
			let noteType = frontmatter.noteType;
			if (noteType in additionalNoteTypes) {
				noteTemplate = additionalNoteTypes[noteType];
			}
		}

		// Find matches for content between double brackets
		// e.g. [[Test]] -> Test
		const regex = /(?<=\[\[).*?(?=\]\])/g;
		let outboundReferences = [...content.matchAll(regex)] || [];
		if (pluginOptions.linkifyHashtags) {
			const hashtagRegexExclusive = /(?<=(^|\s)#)\w*\b/g;
			let hashtagReferences = [...content.matchAll(hashtagRegexExclusive)] || [];
			outboundReferences = outboundReferences.concat(hashtagReferences);
		}
		let internalReferences = [];
		let externalReferences = [];
		// outboundReferences =
		outboundReferences.forEach((match) => {
			let text = match[0];
			let start = match.index;
			let { parent } = findDeepestChildForPosition(null, tree, start);
			// Adding this logic to avoid including too large an amount of content. May need additional heuristics to improve this
			// Right now it essentially will just capture the bullet point or paragraph where it is mentioned.
			let maxDepth = 2;
			for (
				let i = 0;
				i < maxDepth && parent.parent != null && parent.parent.node.type !== "root";
				i++
			) {
				parent = parent.parent;
			}

			let processor = unified()
				.use(stringifyMd, { commonmark: true })
				.use(textNoEscaping)
				.freeze();
			let previewMarkdown = processor.stringify(parent.node);

			const externalRefMatch = /(.*)\/(.*)/;
			let externalRef = text.match(externalRefMatch);
			if (externalRef !== null) {
				if (externalMapsParsed[externalRef[1]]) {
					// External reference
					externalReferences.push({
						text: text,
						site: externalRef[1],
						page: externalRef[2],
						previewMarkdown: previewMarkdown,
					});
				}
			} else {
				// Internal reference
				internalReferences.push({
					text: text,
					previewMarkdown: previewMarkdown,
				});
			}
		});
		allReferences.push({
			source: slug,
			references: internalReferences,
			externalReferences: externalReferences,
		});

		if (frontmatter.title == null) {
			frontmatter.title = slug;
		}

		slugToNoteMap[slug] = {
			title: title,
			content: rawFile,
			rawContent: rawFile,
			fullPath: fullPath,
			frontmatter: frontmatter,
			aliases: aliases,
			outboundReferences: internalReferences,
			externalOutboundReferences: externalReferences,
			noteTemplate: noteTemplate,
			inboundReferences: [],
		};
	});

	return {
		slugToNoteMap: slugToNoteMap,
		nameToSlugMap: nameToSlugMap,
		allReferences: allReferences,
	};
}

module.exports = processMarkdownNotes;