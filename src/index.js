import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { params } from "./params.js";
import prompts from "prompts";
import { write, emptyDir, setProjectRootDir } from "./fs-utils.js";
import * as optionUtils from "./options/index.js";
import * as promptsUtils from "./prompt-utils.js";

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string.
const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

async function init() {
	params.targetDir = promptsUtils.formatTargetDir(argv._[0]) || params.defaultTargetDir;
	params.projectName = params.targetDir === "." ? path.basename(path.resolve()) : params.targetDir;
	promptsUtils.projectName.initial = params.projectName;

	let options;
	try {
		options = await prompts(
			[
				promptsUtils.projectName,
				promptsUtils.pwa,
				promptsUtils.githubActionsGithubPagesWorkflow,
				promptsUtils.navigationDrawer,
				promptsUtils.header,
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

	// console.log(params);

	// console.log(options);
	// console.log();

	const {
		projectName,
		overwrite,
		navigationDrawer,
		header,
		footer,
		pwa,
		baseIcon,
		githubActionsGithubPagesWorkflow,
	} = options;

	const destDir = path.join(cwd, params.targetDir);
	setProjectRootDir(destDir);

	console.log(`\nScaffolding project in ${destDir}...`);
	// create target directory
	if (overwrite) {
		// emptyDir(destDir);
	} else if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		// "../../../vue-webapp"
		"../../src/template"
	);

	// modify package.json
	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
	);
	// pkg.name = projectName || getProjectName();
	// console.log(params);
	pkg.name = params.projectName;
	write(templateDir, "package.json", JSON.stringify(pkg, null, 2) + "\n");

	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => !["package.json", "node_modules"].includes(f))) {
		write(templateDir, file);
	}

	write(templateDir, ".gitignore", `# Logs
logs
*.log
.history
node_modules
dist
*.local
`);

	// ["navigationDrawer", "footer"].forEach((component) => {
	// 	if (!options[component].startsWith("Simple")) {
	// 		setWebappComponent(component, options[component]);
	// 	}
	// });
	optionUtils.setHeader(header);
	optionUtils.setFooter(footer);
	optionUtils.setNavigationDrawer(navigationDrawer);
	optionUtils.setGithubActionsGithubPagesWorkflow(githubActionsGithubPagesWorkflow, params.projectName);
	optionUtils.setBaseIcon(baseIcon);
	optionUtils.setPwa(pwa);
	optionUtils.setTitle(params.projectName);
	optionUtils.setOptionList(options);

	console.log();
}

init().catch((e) => {
	console.error(e);
});
