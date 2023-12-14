import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";
import { params } from "../params.js";

export function setSplashScreen(splashScreen, projectName) {
  if (splashScreen) {
    params.htmlInjections.push({
      name: "Splash screen",
      path: "./src/utils/injections/splash-screen.html",
      type: "raw",
      injectTo: "body-prepend",
    });
    replaceTextInFile(
      "src/utils/injections/splash-screen.html",
      "project-name",
      projectName
    );
  } else {
    deleteDirOrFile("src/utils/injections/splash-screen.html");
  }
}
