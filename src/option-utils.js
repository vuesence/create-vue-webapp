import { replaceTextInFile, deleteDirOrFile } from "./fs-utils.js";

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
function setBaseIcon(baseIcon) {
	if (!baseIcon) {
		deleteDirOrFile("src/utils/icons.ts");
		deleteDirOrFile("src/components/ui/BaseIcon.vue");
		deleteDirOrFile("src/assets/vue-icon.svg");
		replaceTextInFile(
			"src/main.ts",
			`import { loadIcons } from "@/utils/icons";\n`,
			"",
		);
		replaceTextInFile(
			"src/main.ts",
			"loadIcons();\n",
			"",
		);
		replaceTextInFile(
			"src/components/headers/SimpleHeader.vue",
			`import BaseIcon from "@/components/ui/BaseIcon.vue";\n`,
			""
		);
		replaceTextInFile(
			"src/components/headers/SimpleHeader.vue",
			`<BaseIcon name="hamburger" class="drawer-toggle" @click="isDrawerOpen = !isDrawerOpen" />`,
			`<div @click="isDrawerOpen = !isDrawerOpen">
				<img src="@/assets/images/hamburger.svg" class="drawer-toggle"  />
			</div>`
		);
	} else {
	}
}
function setPwa(pwa) {
	console.log("pwa", pwa);
	if (!pwa) {
		deleteDirOrFile("public/manifest.json");
		deleteDirOrFile("public/service-worker.js");
		replaceTextInFile(
			"index.html",
			"<!-- service-worker placeholder -->\n",
			""
		);
	} else {
		replaceTextInFile(
			"index.html",
			"<!-- service-worker placeholder -->",
			`
		<script>
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.register("/service-worker.js");
			}
		</script>`
		);
	}
}


function setTitle(title) {
	replaceTextInFile(
		"index.html",
		"<!-- title -->",
		title
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
};
