import { replaceTextInFile, writeToFile } from "../fs-utils.js";
import { setBaseIcon } from "./base-icon.js";
import { setSplashScreen } from "./splash-screen.js";
import { setOpenGraph } from "./open-graph.js";
import { setPwa } from "./pwa.js";
import { setI18n } from "./i18n.js";
import { setGoogleAnalytics } from "./google-analytics.js";
import { setApi } from "./api.js";
import { setHeader } from "./header.js";
import { setGithubActionsGithubPagesWorkflow } from "./github-actions.js";
import { params } from "../params.js";

function setLayout(layout) {
  if (layout !== "MainLayout") {
    replaceTextInFile(
      "src/assets/styles/custom.scss",
      "// layout-placeholder",
      `:root {
  --vwa-layout-max-width: 800px;  
}
.notebook .navigation-drawer, .desktop .navigation-drawer {
  display: none;
}`
    );
  }
}

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

function setHtmlInjections() {
  // console.log(params.htmlInjections);
  const data =
    `import type { IHtmlInjectionConfig } from "vite-plugin-html-injection";\n    
export const htmlInjectionConfig: IHtmlInjectionConfig = {
  injections: ` +
    JSON.stringify(params.htmlInjections, null, 2) +
    "  \n};\n";
  writeToFile("src/utils/injections/injection-config.ts", data);
}

function setTitle(title) {
  replaceTextInFile("index.html", "<!-- title placeholder -->", title);
}

function setOptionList(options) {
  let optionArrayStr = [];
  const titles = {
    projectName: "Project name",
    navigationDrawer: "Navigation drawer",
    layout: "App Layout",
    navbar: "Navbar",
    header: "Header",
    footer: "Footer",
    baseIcon: "BaseIcon",
    pwa: "PWA",
    googleAnalytics: "Google Analytics",
    api: "REST API adapter",
    splashScreen: "Splash screen",
    openGraph: "Open graph meta tags",
    jsonRpc: "JSON-RPC",
    githubActionsGithubPagesWorkflow: "Github Actions Workflow",
  };
  for (let name in options) {
    // console.log(name);
    if (!["overwrite"].includes(name)) {
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
  setSplashScreen,
  setLayout,
  setNavbar,
  setHeader,
  setFooter,
  setNavigationDrawer,
  setGithubActionsGithubPagesWorkflow,
  setBaseIcon,
  setPwa,
  setI18n,
  setGoogleAnalytics,
  setApi,
  setOpenGraph,
  setTitle,
  setHtmlInjections,
  setOptionList,
};
