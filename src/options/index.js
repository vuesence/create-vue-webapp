import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";
import { setBaseIcon } from "./base-icon.js";
import { setPwa } from "./pwa.js";

function setHeader(header) { }
function setFooter(footer) {
	if (footer && !footer.startsWith("Simple")) {
		replaceTextInFile("src/layouts/MainLayout.vue", "SimpleFooter", footer);
	}
}
function setNavigationDrawer(navigationDrawer) {
	if (navigationDrawer && !navigationDrawer.startsWith("Simple")) {
		replaceTextInFile(
			"src/layouts/MainLayout.vue",
			"SimpleDrawer",
			navigationDrawer
		);
	}
}

function setGithubActionsWorkflow(githubActionsWorkflow) {
	if (!githubActionsWorkflow) {
		deleteDirOrFile(".github");
	}
}


function setTitle(title) {
	replaceTextInFile(
		"index.html",
		"<!-- title placeholder -->",
		title
	);
}

function setOptionList(options) {
	let optionArrayStr = [];
	const titles = {
		"projectName": "Project name",
		"navigationDrawer": "Navigation drawer",
		"header": "Header",
		"footer": "Footer",
		"baseIcon": "BaseIcon",
		"pwa": "PWA",
		"githubActionsWorkflow": "Github Actions Workflow",
	};
	for (let name in options) {
		console.log(name);
		if (options[name] !== false && !["overwrite"].includes(name)) {
			optionArrayStr.push(`{name: "${titles[name]}", value: "${options[name]}"}`);
		}
	}
	optionArrayStr = `[${optionArrayStr.join(",")}]`;
	replaceTextInFile(
		"src/views/HomeView.vue",
		"// options placeholder",
		`options = ${optionArrayStr};`
	);
}

export {
	setHeader,
	setFooter,
	setNavigationDrawer,
	setGithubActionsWorkflow,
	setBaseIcon,
	setPwa,
	setTitle,
	setOptionList,
};
