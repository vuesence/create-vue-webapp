import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";
import { setBaseIcon } from "./base-icon.js";
import { setPwa } from "./pwa.js";
import { setHeader } from "./header.js";

function setNavbar(navbar) {
  if (navbar && navbar !== "SimpleNavbar") {
    replaceTextInFile(
      "src/layouts/MainLayout.vue",
      "/SimpleNavbar.vue",
      "/" + navbar + ".vue"
    );
  }
}

function setFooter(footer) {
  if (footer && footer !== "SimpleFooter") {
    replaceTextInFile(
      "src/layouts/MainLayout.vue",
      "/SimpleFooter.vue",
      "/" + footer + ".vue"
    );
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

function setGithubActionsGithubPagesWorkflow(
  githubActionsGithubPagesWorkflow,
  projectName
) {
  if (githubActionsGithubPagesWorkflow) {
    // replaceTextInFile(
    // 	"vite.config.ts",
    // 	`export default defineConfig({`,
    // 	`export default defineConfig({
    // 	base: "${projectName}",`
    // );
  } else {
    deleteDirOrFile(".github/workflows/gp-deploy.yaml");
  }
  deleteDirOrFile(".github/README.md");
  deleteDirOrFile(".github/webapp-start.png");
}

function setTitle(title) {
  replaceTextInFile("index.html", "<!-- title placeholder -->", title);
}

function setOptionList(options) {
  let optionArrayStr = [];
  const titles = {
    projectName: "Project name",
    navigationDrawer: "Navigation drawer",
    navbar: "Navbar",
    header: "Header",
    footer: "Footer",
    baseIcon: "BaseIcon",
    pwa: "PWA",
    githubActionsGithubPagesWorkflow: "Github Actions Workflow",
  };
  for (let name in options) {
    // console.log(name);
    if (options[name] !== false && !["overwrite"].includes(name)) {
      optionArrayStr.push(
        `{name: "${titles[name]}", value: "${options[name]}"}`
      );
    }
  }
  optionArrayStr = `[${optionArrayStr.join(",")}]`;
  replaceTextInFile(
    "src/views/HomeView.vue",
    "options: IOption[] = [];",
    `options: IOption[] = ${optionArrayStr};`
  );
}

export {
  setNavbar,
  setHeader,
  setFooter,
  setNavigationDrawer,
  setGithubActionsGithubPagesWorkflow,
  setBaseIcon,
  setPwa,
  setTitle,
  setOptionList,
};
