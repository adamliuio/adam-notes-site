const url = require("url");
const http = require("http");
const chokidar = require("chokidar");
const remark2rehype = require("remark-rehype");
const path = require("path");

const generateBrainMap = require("./funcs/generate-brain-map");
const externalMapFetcher = require("./funcs/external-map-fetcher");
const createFSMachine = require("./funcs/create-fs-machine");
const generateNodes = require("./funcs/generate-nodes");

module.exports = async (api, pluginOptions) => {
	let externalMaps = pluginOptions.mappedExternalBrains || {};
	let externalMapsParsed = await externalMapFetcher(externalMaps);

	const fsMachine = createFSMachine(api, pluginOptions, externalMapsParsed);

	api.emitter.on(`BOOTSTRAP_FINISHED`, () => {
		fsMachine.send(`BOOTSTRAP_FINISHED`);
	});

	generateNodes(
		api.actions,
		api.createNodeId,
		api.createContentDigest,
		pluginOptions,
		externalMapsParsed
	);

	const notesDirectory = pluginOptions.notesDirectory || "content/brain/";
	const watchPath = path.resolve(process.cwd(), notesDirectory);
	const watcher = chokidar.watch(watchPath);

	watcher.on(`add`, (path) => {
		fsMachine.send({ type: `CHOKIDAR_ADD`, pathType: `file`, path });
	});

	watcher.on(`change`, (path) => {
		fsMachine.send({
			type: `CHOKIDAR_CHANGE`,
			pathType: `file`,
			path,
		});
	});

	watcher.on(`unlink`, (path) => {
		fsMachine.send({
			type: `CHOKIDAR_UNLINK`,
			pathType: `file`,
			path,
		});
	});

	return new Promise((resolve, reject) => {
		watcher.on(`ready`, () => {
			fsMachine.send({ type: `CHOKIDAR_READY`, resolve, reject });
		});
	});
};
