import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";

export function setGithubActionsGithubPagesWorkflow(
  githubActionsGithubPagesWorkflow,
  projectName
) {
  if (githubActionsGithubPagesWorkflow) {
    replaceTextInFile(
      "vite.config.ts",
      `export default defineConfig({`,
      `export default defineConfig({
    	base: "${projectName}",`
    );
  } else {
    deleteDirOrFile(".github/workflows/gp-deploy.yaml");
  }
  deleteDirOrFile(".github/README.md");
  deleteDirOrFile(".github/webapp-start.png");
}
