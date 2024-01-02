import fs from "node:fs";
import { params } from "./params.js";
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

export const layout = {
  type: "select",
  name: "layout",
  message: reset("Select application layout"),
  choices: [
    { title: lightBlue("MainLayout"), value: "MainLayout" },
    { title: lightGreen("OneColumnLayout"), value: "OneColumnLayout" },
  ],
};

export const navbar = {
  type: "select",
  name: "navbar",
  message: reset("Select webapp navbar"),
  choices: [
    { title: lightBlue("SimpleNavbar"), value: "SimpleNavbar" },
    { title: lightGreen("MantineSimpleNavbar"), value: "MantineSimpleNavbar" },
  ],
};

export const header = {
  type: "select",
  name: "header",
  message: reset("Select webapp header"),
  choices: [
    { title: lightBlue("SimpleHeader"), value: "SimpleHeader" },
    { title: lightGreen("MantineSimpleHeader"), value: "MantineSimpleHeader" },
    {
      title: lightGreen("MantineLayeredHeader"),
      value: "MantineLayeredHeader",
    },
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

export const splashScreen = {
  type: "toggle",
  name: "splashScreen",
  message: reset("Add a Splash screen?"),
  active: "yes",
  inactive: "no",
};

export const pwa = {
  type: "toggle",
  name: "pwa",
  message: reset("Make it PWA (adds service worker and manifest)?"),
  active: "yes",
  inactive: "no",
};

export const i18n = {
  type: "toggle",
  name: "i18n",
  message: reset("Add light version of i18n?"),
  active: "yes",
  inactive: "no",
};

export const openGraph = {
  type: "toggle",
  name: "openGraph",
  message: reset("Add Open Graph meta tags?"),
  active: "yes",
  inactive: "no",
};

export const googleAnalytics = {
  type: "toggle",
  name: "googleAnalytics",
  message: reset("Add Google Analytics code?"),
  active: "yes",
  inactive: "no",
};

export const api = {
  type: "toggle",
  name: "api",
  message: reset("Add API layer (REST)?"),
  active: "yes",
  inactive: "no",
};

export const jsonRpc = {
  type: (prev) => prev && "toggle",
  name: "jsonRpc",
  message: reset("Add JSON-RPC adapter?"),
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
  message: reset(
    "Add Github Action Workflow for publishing it on GitHub Pages?"
  ),
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
  // validate: (dir) => isValidPackageName(dir) || "Invalid package.json 'name'",
};

export const dirOverwriteCheck = [
  {
    type: () => {
      if (!fs.existsSync(params.targetDir)) {
        return null;
      }
      const files = fs.readdirSync(params.targetDir);
      return files.length === 0 || (files.length === 1 && files[0] === ".git")
        ? null
        : "select";
    },
    name: "overwrite",
    message: () =>
      (params.targetDir === "."
        ? "Current directory"
        : `Target directory "${params.targetDir}"`) +
      ` is not empty. Please choose how to proceed:`,
    initial: 0,
    choices: [
      {
        title: "Remove existing files and continue",
        value: "yes",
      },
      {
        title: "Cancel operation",
        value: "no",
      },
      {
        title: "Ignore files and continue",
        value: "ignore",
      },
    ],
  },
  {
    type: (_, { overwrite }) => {
      if (overwrite === "no") {
        throw new Error(red("✖") + " Operation cancelled");
      }
      return null;
    },
    name: "overwriteChecker",
  },
];

function isValidPackageName(projectName) {
  // console.log("checking validness", projectName);
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    params.projectName
  );
}

function toValidPackageName(projectName) {
  // console.log("to valid", projectName);
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
