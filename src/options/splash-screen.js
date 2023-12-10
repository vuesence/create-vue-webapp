import { deleteDirOrFile } from "../fs-utils.js";
import { params } from "../params.js";

export function setSplashScreen(splashScreen) {
  if (splashScreen) {
    params.htmlInjections.push({
      name: "Splash screen",
      path: "./src/utils/injections/splash-screen.html",
      type: "raw",
      injectTo: "body-prepend",
    });
  } else {
    deleteDirOrFile("src/utils/injections/splash-screen.html");
  }
}
