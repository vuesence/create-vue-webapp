import { deleteDirOrFile } from "../fs-utils.js";
import { params } from "../params.js";

export function setPwa(pwa) {
  // console.log("pwa", pwa);
  if (pwa) {
    params.htmlInjections.push({
      name: "Service worker",
      path: "./src/utils/injections/sw.js",
      type: "js",
      injectTo: "head",
    });
  } else {
    deleteDirOrFile("public/manifest.json");
    deleteDirOrFile("public/service-worker.js");
    deleteDirOrFile("src/utils/injections/sw.js");
  }
}
