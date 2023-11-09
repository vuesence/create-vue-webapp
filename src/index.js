import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import prompts from "prompts";
import { write, isValidPackageName, toValidPackageName, isEmpty, emptyDir, formatTargetDir } from "./utils.js";
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

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

console.log(argv);

const defaultTargetDir = "my-vue-project";

async function init() {
	const argTargetDir = formatTargetDir(argv._[0]);

	let targetDir = argTargetDir || defaultTargetDir;
	const getProjectName = () =>
		targetDir === "." ? path.basename(path.resolve()) : targetDir;

	let result;

	try {
		result = await prompts(
			[
				{
					type: argTargetDir ? null : "text",
					name: "projectName",
					message: reset("Project name:"),
					initial: defaultTargetDir,
					onState: (state) => {
						targetDir = formatTargetDir(state.value) || defaultTargetDir;
					},
				},
				{
					type: prev => prev && 'toggle',
					name: 'createPwa',
					message: reset("Make it PWA (adds service worker and manifest)?"),
					active: 'yes',
					inactive: 'no'
				},
				{
					type: 'select',
					name: 'navigationDrawerType',
					message: reset('Select navigation drawer type'),
					choices: [
						{ title: lightGreen('TouchSliderDrawer'), description: 'Uses touch swipe events', value: 'TouchSliderDrawer' },
						{ title: lightBlue('SimpleDrawer'), description: 'Simple navigation drawer', value: 'SimpleDrawer' },
					]
				},
				{
					type: () => (isValidPackageName(getProjectName()) ? null : "text"),
					// type: "text",
					name: "packageName",
					message: reset("Package name:"),
					initial: () => toValidPackageName(getProjectName()),
					validate: (dir) =>
						isValidPackageName(dir) || "Invalid package.json name",
				},

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
				},
				// {
				//   type: 'number',
				//   name: 'prompt',
				//   message: 'This will be overridden',
				//   onRender(color) {
				//     this.no = (this.no || 1);
				//     this.msg = `Enter a number (e.g. ${color.cyan(this.no)})`;
				//     let interval = setInterval(() => {
				//       this.no += 1;
				//       this.render();
				//     }, 1000);
				//   }
				// }
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

	const { overwrite, packageName, navigationDrawerType, createPwa } = result;

	const root = path.join(cwd, targetDir);

	if (overwrite) {
		emptyDir(root);
	} else if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	console.log(`\nScaffolding project in ${root}...`);

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		"../../src",
		`template`
	);
	// const root = path.join(cwd, targetDir);

	console.log("templateDir", templateDir);


	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
	);

	pkg.name = packageName || getProjectName();

	write(templateDir, root, "package.json", JSON.stringify(pkg, null, 2) + "\n");

	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => f !== "package.json")) {
		write(templateDir, root, file);
	}

	console.log();
}


init().catch((e) => {
	console.error(e);
});