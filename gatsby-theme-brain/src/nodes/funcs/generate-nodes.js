const path = require("path");
const unified = require("unified");
const html = require("rehype-stringify");
const markdown = require("remark-parse");
const insertLinks = require("./insert-links");
const remark2rehype = require("remark-rehype");
const generateSlug = require("./generate-slug");
const getMarkdownNotes = require("./get-markdown-notes");
const processMarkdownNotes = require("./process-markdown-notes");

function generateNodes(
	actions,
	createNodeId,
	createContentDigest,
	pluginOptions,
	externalMapsParsed
) {
	let markdownNotes = getMarkdownNotes(pluginOptions);
	let { slugToNoteMap, nameToSlugMap, allReferences } = processMarkdownNotes(
		markdownNotes,
		pluginOptions,
		externalMapsParsed
	);

	let brainBaseUrl = pluginOptions.brainBaseUrl || "";
	let externalInboundReferences = new Map();
	for (let mapName in externalMapsParsed) {
		let map = externalMapsParsed[mapName];
		map["externalReferences"]
			.filter((it) => {
				return it["targetSite"] == brainBaseUrl;
			})
			.map(({ targetSite, targetPage, sourcePage, previewHtml }) => {
				let externalUrl = url.resolve(map["rootDomain"], sourcePage);
				targetPage = nameToSlugMap[generateSlug(targetPage)];

				if (externalInboundReferences[targetPage] == null) {
					externalInboundReferences[targetPage] = [];
				}
				externalInboundReferences[targetPage].push({
					siteName: mapName,
					sourcePage: sourcePage,
					sourceUrl: externalUrl,
					previewHtml: previewHtml,
				});
			});
	}

	let noteTemplate = pluginOptions.noteTemplate || "./templates/brain.js";
	noteTemplate = require.resolve(noteTemplate);

	let backlinkMap = new Map();

	let externalRefMap = new Map();

	allReferences.forEach(({ source, references, externalReferences }) => {
		if (references == null) return;

		references.forEach(({ text, previewMarkdown }) => {
			let reference = text;

			let lower = reference.toLowerCase();

			if (nameToSlugMap[lower] == null) {
				let slug = pluginOptions.generateSlug
					? pluginOptions.generateSlug(reference)
					: generateSlug(lower);

				if (nameToSlugMap[slug] == null) {
					// Double check that the slugified version isn't already there
					slugToNoteMap[slug] = {
						slug: slug,
						title: slug,
						content: "",
						rawContent: "",
						frontmatter: {
							title: slug,
						},
						aliases: [],
						noteTemplate: noteTemplate,
						outboundReferences: [],
						inboundReferences: [],
						externalOutboundReferences: [],
					};
					nameToSlugMap[slug] = slug;
				}

				nameToSlugMap[lower] = slug;
			}

			let slug = nameToSlugMap[lower];
			if (backlinkMap[slug] == null) {
				backlinkMap[slug] = [];
			}
			backlinkMap[slug].push({
				source: source,
				previewMarkdown: previewMarkdown,
			});
		});

		externalReferences.forEach(({ text, site, page }) => {
			let lower = text.toLowerCase();
			let externalMap = externalMapsParsed[site];
			if (!externalMap) {
				return;
			}
			let rootDomain = externalMap["rootDomain"];
			let externalPages = externalMap["pages"];
			let linkedPage = null;
			for (var externalPage in externalPages) {
				let aliases = externalPages[externalPage];
				if (aliases.includes(page)) {
					linkedPage = externalPage;
				}
			}
			if (linkedPage !== null) {
				let externalUrl = url.resolve(rootDomain, linkedPage);
				externalRefMap[lower] = externalUrl;
			}
		});
	});

	// Create Nodes
	let slugToNoteNodeMap = new Map();
	let rootPath = pluginOptions.rootPath || "brain";

	for (let slug in slugToNoteMap) {
		let note = slugToNoteMap[slug];

		const newRawContent = insertLinks(
			note.content,
			nameToSlugMap,
			externalRefMap,
			path.join("/", rootPath, "/"),
			pluginOptions
		);

		const brainNoteNode = {
			id: createNodeId(`${slug} >>> BrainNote`),
			title: note.title,
			slug: slug,
			content: newRawContent,
			rawContent: newRawContent,
			absolutePath: note.fullPath,
			noteTemplate: note.noteTemplate,
			aliases: note.aliases,
			children: [],
			parent: null,
			internal: {
				type: `BrainNote`,
				mediaType: `text/markdown`,
			},
		};

		let outboundReferences = note.outboundReferences;

		// Use the slug for easier use in queries
		let outboundReferenceSlugs = outboundReferences.map(
			(match) => nameToSlugMap[match.text.toLowerCase()]
		);

		// Remove duplicates
		brainNoteNode.outboundReferences = [...new Set(outboundReferenceSlugs)];

		let inboundReferences = backlinkMap[slug] || [];
		let inboundReferenceSlugs = inboundReferences.map(({ source }) => source);
		brainNoteNode.inboundReferences = inboundReferenceSlugs.filter(
			(a, b) => inboundReferenceSlugs.indexOf(a) === b
		);
		brainNoteNode.inboundReferencePreviews = inboundReferences.map(
			({ source, previewMarkdown }) => {
				let linkifiedMarkdown = insertLinks(
					previewMarkdown,
					nameToSlugMap,
					externalRefMap,
					path.join("/", rootPath, "/"),
					pluginOptions
				);

				let previewHtml = unified()
					.use(markdown, { gfm: true, commonmark: true, pedantic: true })
					.use(remark2rehype)
					.use(html)
					.processSync(linkifiedMarkdown)
					.toString();
				return {
					source: source,
					previewMarkdown: linkifiedMarkdown,
					previewHtml: previewHtml,
				};
			}
		);

		brainNoteNode.externalInboundReferences = externalInboundReferences[slug];
		brainNoteNode.externalOutboundReferences = note.externalOutboundReferences.map(
			({ text, site, page, previewMarkdown }) => {
				let linkifiedMarkdown = insertLinks(
					previewMarkdown,
					nameToSlugMap,
					externalRefMap,
					brainBaseUrl,
					pluginOptions
				);

				let previewHtml = unified()
					.use(markdown, { gfm: true, commonmark: true, pedantic: true })
					.use(remark2rehype)
					.use(html)
					.processSync(linkifiedMarkdown)
					.toString();

				let rootDomain = externalMapsParsed[site]["rootDomain"];
				return {
					targetSite: rootDomain,
					targetPage: page,
					previewHtml: previewHtml,
				};
			}
		);

		brainNoteNode.internal.contentDigest = createContentDigest(brainNoteNode);

		slugToNoteNodeMap[slug] = brainNoteNode;
	}

	const { createNode } = actions;
	for (let slug in slugToNoteNodeMap) {
		let brainNoteNode = slugToNoteNodeMap[slug];

		let outboundReferenceNoteIds = brainNoteNode.outboundReferences.map(
			(matchSlug) => slugToNoteNodeMap[matchSlug].id
		);
		brainNoteNode.outboundReferenceNotes___NODE = outboundReferenceNoteIds;

		let inboundReferenceNoteIds = brainNoteNode.inboundReferences.map(
			(matchSlug) => slugToNoteNodeMap[matchSlug].id
		);
		brainNoteNode.inboundReferenceNotes___NODE = inboundReferenceNoteIds;

		createNode(brainNoteNode);
	}

	let shouldGenerateBrainMap = pluginOptions.generateBrainMap || false;
	if (shouldGenerateBrainMap) {
		generateBrainMap(pluginOptions, slugToNoteNodeMap);
	}
}

module.exports = generateNodes;