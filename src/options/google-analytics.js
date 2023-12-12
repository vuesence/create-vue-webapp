import { deleteDirOrFile } from "../fs-utils.js";
import { params } from "../params.js";

export function setGoogleAnalytics(googleAnalytics) {
  if (googleAnalytics) {
    params.htmlInjections.push({
      name: "Google analytics",
      path: "./src/utils/injections/gtag.html",
      type: "raw",
      injectTo: "body",
    });
  } else {
    deleteDirOrFile("src/utils/injections/gtag.js");
  }
}
