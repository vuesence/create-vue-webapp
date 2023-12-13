import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { params } from "./params.js";
import prompts from "prompts";
import { emptyDir, copyDir, writeToFile } from "./fs-utils.js";
import * as optionUtils from "./options/index.js";
import * as promptsUtils from "./prompt.js";

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string.
const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();
const optionsFile = argv.config || argv.c;

async function init() {
  params.targetDir =
    promptsUtils.formatTargetDir(argv._[0]) || params.defaultTargetDir;
  params.projectName =
    params.targetDir === "." ? path.basename(path.resolve()) : params.targetDir;
  promptsUtils.projectName.initial = params.projectName;

  let options;
  if (optionsFile) {
    options = JSON.parse(fs.readFileSync(optionsFile, "utf8"));
  } else {
    try {
      options = await prompts(
        [
          promptsUtils.projectName,
          promptsUtils.splashScreen,
          promptsUtils.pwa,
          promptsUtils.openGraph,
          promptsUtils.googleAnalytics,
          promptsUtils.githubActionsGithubPagesWorkflow,
          promptsUtils.layout,
          promptsUtils.navigationDrawer,
          promptsUtils.navbar,
          promptsUtils.header,
          promptsUtils.footer,
          promptsUtils.api,
          promptsUtils.jsonRpc,
          // promptsUtils.baseIcon,
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
  }

  // console.log(params);

  // console.log(options);
  // console.log();

  const {
    projectName,
    splashScreen,
    overwrite,
    navigationDrawer,
    layout,
    navbar,
    header,
    footer,
    pwa,
    googleAnalytics,
    api,
    openGraph,
    jsonRpc,
    // baseIcon,
    githubActionsGithubPagesWorkflow,
  } = options;

  const destDir = path.join(cwd, params.targetDir);
  params.targetDirPath = destDir;

  // console.log(params);

  console.log(`\nScaffolding project in ${destDir}...`);
  // create target directory
  if (overwrite === "yes") {
    emptyDir(destDir);
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    // "../../../vue-webapp"
    "../../src/template"
  );

  // const files = fs.readdirSync(templateDir);
  // for (const file of files.filter((f) => !["node_modules"].includes(f))) {
  //   write(templateDir, file);
  // }
  copyDir(templateDir, destDir);

  // modify package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(destDir, `package.json`), "utf-8")
  );
  pkg.name = params.projectName;
  writeToFile("package.json", JSON.stringify(pkg, null, 2) + "\n");

  writeToFile(
    ".gitignore",
    `# Logs
logs
*.log
.history
node_modules
dist
*.local
`
  );

  // ["navigationDrawer", "footer"].forEach((component) => {
  // 	if (!options[component].startsWith("Simple")) {
  // 		setWebappComponent(component, options[component]);
  // 	}
  // });
  optionUtils.setLayout(layout);
  optionUtils.setNavbar(navbar);
  optionUtils.setHeader(header);
  optionUtils.setFooter(footer);
  optionUtils.setNavigationDrawer(navigationDrawer);
  optionUtils.setGithubActionsGithubPagesWorkflow(
    githubActionsGithubPagesWorkflow,
    params.projectName
  );
  // optionUtils.setBaseIcon(baseIcon);
  optionUtils.setOpenGraph(openGraph);
  optionUtils.setSplashScreen(splashScreen, projectName);
  optionUtils.setPwa(pwa);
  optionUtils.setGoogleAnalytics(googleAnalytics);
  optionUtils.setApi(api, jsonRpc);
  optionUtils.setTitle(params.projectName);
  optionUtils.setOptionList(options);
  // console.log(params);
  optionUtils.setHtmlInjections();

  console.log();
}

init().catch((e) => {
  console.error(e);
});
