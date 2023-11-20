import fs from "node:fs";
import path from "node:path";
// import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { isEmpty } from "./fs-utils.js";
import {
	blue,
	cyan,
	green,
	lightBlue,
	lightGreen,
	lightRed,
	magenta,
	red,
	reset,
	yellow,
} from "kolorist";

const defaultTargetDir = "my-vue-project";
const argv = minimist(process.argv.slice(2), { string: ["_"] });

const argTargetDir = formatTargetDir(argv._[0]);
let targetDir = argTargetDir || defaultTargetDir;

const getProjectName = () =>
	targetDir === "." ? path.basename(path.resolve()) : targetDir;

export const projectName = {
	// type: targetDir ? null : "text",
	type: "text",
	name: "projectName",
	message: reset("Project name:"),
	initial: targetDir,
	onState: (state) => {
		targetDir = formatTargetDir(state.value) || defaultTargetDir;
	},
};

export const navigationDrawer = {
	type: "select",
	name: "navigationDrawer",
	message: reset("Select navigation drawer"),
	choices: [
		{
			title: lightBlue("SimpleDrawer"),
			description: "Simple navigation drawer",
			value: "SimpleDrawer",
		},
		{
			title: lightGreen("TouchSlideoutDrawer"),
			description: "Uses touch swipe events",
			value: "TouchSlideoutDrawer",
		},
	],
};

export const header = {
	type: "select",
	name: "header",
	message: reset("Select webapp header"),
	choices: [
		{ title: lightBlue("SimpleHeader"), value: "SimpleHeader" },
		{ title: lightGreen("SlidingHeader"), value: "SlidingHeader" },
	],
};

export const footer = {
	type: "select",
	name: "footer",
	message: reset("Select webapp footer"),
	choices: [
		{ title: lightBlue("SimpleFooter"), value: "SimpleFooter" },
		{ title: lightGreen("RichFooter"), value: "RichFooter" },
		{ title: lightGreen("DistributedFooter"), value: "DistributedFooter" },
	],
};

export const pwa = {
	type: "toggle",
	name: "pwa",
	message: reset("Make it PWA (adds service worker and manifest)?"),
	active: "yes",
	inactive: "no",
};

export const baseIcon = {
	type: "toggle",
	name: "baseIcon",
	message: reset("Add `BaseIcon` component?"),
	active: "yes",
	inactive: "no",
};

export const githubActionsWorkflow = {
	// type: (prev) => prev && "toggle",
	type: "toggle",
	name: "githubActionsWorkflow",
	// message: reset("Add Github Action Workflow to build and deploy it to gh-pages branch for publishing on GitHub Pages?"),
	message: reset("Add Github Action Workflow for publishing it on GitHub Pages?"),
	active: "yes",
	inactive: "no",
};

export const packageNameCheck = {
	type: () => (isValidPackageName(getProjectName()) ? null : "text"),
	// type: "text",
	name: "packageName",
	message: reset("Package name:"),
	initial: () => toValidPackageName(getProjectName()),
	validate: (dir) =>
		isValidPackageName(dir) || "Invalid package.json name",
};

export const dirOverwriteCheck = [
	{
		type: () =>
			!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
		name: "overwrite",
		message: () =>
			(targetDir === "."
				? "Current directory"
				: `Target directory "${targetDir}"`) +
			` is not empty. Remove existing files and continue?`,
	},
	{
		type: (_, { overwrite }) => {
			if (overwrite === false) {
				throw new Error(red("✖") + " Operation cancelled");
			}
			return null;
		},
		name: "overwriteChecker",
	}
]

function isValidPackageName(projectName) {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName
	);
}

function toValidPackageName(projectName) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
}

export function formatTargetDir(targetDir) {
	return targetDir?.trim().replace(/\/+$/g, "");
}