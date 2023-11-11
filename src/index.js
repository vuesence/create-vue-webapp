import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import prompts from "prompts";
import { write, emptyDir, setProjectRootDir } from "./fs-utils.js";
import * as options from "./option-utils.js";
import * as promptsUtils from "./prompt-utils.js";

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();
const defaultTargetDir = "my-vue-project";

async function init() {
	const argTargetDir = promptsUtils.formatTargetDir(argv._[0]);
	let targetDir = argTargetDir || defaultTargetDir;
	// promptsUtils.setEnv(targetDir, defaultTargetDir);
	// console.log("promptsUtils.projectName", promptsUtils.projectName);
	const getProjectName = () =>
		targetDir === "." ? path.basename(path.resolve()) : targetDir;

	let result;

	try {
		result = await prompts(
			[
				promptsUtils.projectName,
				promptsUtils.pwa,
				promptsUtils.githubActionsWorkflow,
				promptsUtils.navigationDrawer,
				promptsUtils.footer,
				promptsUtils.baseIcon,
				promptsUtils.packageNameCheck,
				...promptsUtils.dirOverwriteCheck,
			],
			{
				onCancel: () => {
					throw new Error(red("✖") + " Operation cancelled");
				},
			}
		);
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}

	console.log(result);
	console.log();

	const {
		packageName,
		overwrite,
		navigationDrawer,
		footer,
		pwa,
		baseIcon,
		githubActionsWorkflow,
	} = result;

	const destDir = path.join(cwd, targetDir);
	setProjectRootDir(destDir);

	console.log(`\nScaffolding project in ${destDir}...`);
	// create target directory
	if (overwrite) {
		emptyDir(destDir);
	} else if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		"../../../vue-webapp"
		// "../../src/template"
	);

	// modify package.json
	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
	);
	pkg.name = packageName || getProjectName();
	write(templateDir, "package.json", JSON.stringify(pkg, null, 2) + "\n");

	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => !["package.json", ".git", "node_modules"].includes(f))) {
		write(templateDir, file);
	}

	// ["navigationDrawer", "footer"].forEach((component) => {
	// 	if (!result[component].startsWith("Simple")) {
	// 		setWebappComponent(component, result[component]);
	// 	}
	// });
	options.setFooter(footer);
	options.setNavigationDrawer(navigationDrawer);
	options.setGithubActionsWorkflow(githubActionsWorkflow);
	options.setBaseIcon(baseIcon);
	options.setPwa(pwa);
	options.setTitle(getProjectName());

	console.log();
}

init().catch((e) => {
	console.error(e);
});
