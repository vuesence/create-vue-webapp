import fs from "node:fs";
import { params } from "./params.js";
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

export const projectName = {
	// type: targetDir ? null : "text",
	type: "text",
	name: "projectName",
	message: reset("Project name:"),
	initial: params.projectName,
	onState: (state) => {
		params.projectName = formatTargetDir(state.value) || params.targetDir;
		params.targetDir = params.targetDir === "." ? "." : params.projectName;
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
		{ title: lightGreen("MantineSimpleHeader"), value: "MantineSimpleHeader" },
		{ title: lightGreen("MantineLayeredHeader"), value: "MantineLayeredHeader" },
		{ title: lightGreen("SlidingHeader"), value: "SlidingHeader" },
	],
};

export const footer = {
	type: "select",
	name: "footer",
	message: reset("Select webapp footer"),
	choices: [
		{ title: lightBlue("SimpleFooter"), value: "SimpleFooter" },
		{ title: lightGreen("MantineSimpleFooter"), value: "MantineSimpleFooter" },
		{ title: lightGreen("MantineRichFooter"), value: "MantineRichFooter" },
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

export const githubActionsGithubPagesWorkflow = {
	// type: (prev) => prev && "toggle",
	type: "toggle",
	name: "githubActionsGithubPagesWorkflow",
	// message: reset("Add Github Action Workflow to build and deploy it to gh-pages branch for publishing on GitHub Pages?"),
	message: reset("Add Github Action Workflow for publishing it on GitHub Pages?"),
	active: "yes",
	inactive: "no",
};

export const packageNameCheck = {
	// type: () => (isValidPackageName(getProjectName()) ? null : "text"),
	type: () => (isValidPackageName(params.projectName) ? null : "text"),
	// type: "text",
	name: "packageName",
	message: reset("Package name:"),
	// initial: () => toValidPackageName(getProjectName()),
	initial: () => toValidPackageName(params.projectName),
	validate: (dir) =>
		isValidPackageName(dir) || "Invalid package.json name",
};

export const dirOverwriteCheck = [
	{
		type: () =>
			!fs.existsSync(params.targetDir) || isEmpty(params.targetDir) ? null : "confirm",
		name: "overwrite",
		message: () =>
			(params.targetDir === "."
				? "Current directory"
				: `Target directory "${params.targetDir}"`) +
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
		params.projectName
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