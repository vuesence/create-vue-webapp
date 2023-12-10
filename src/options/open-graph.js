import { deleteDirOrFile } from "../fs-utils.js";
import { params } from "../params.js";

export function setOpenGraph(openGraph) {
  // console.log("openGraph", openGraph);
  if (openGraph) {
    params.htmlInjections.push({
      name: "Open Graph",
      path: "./src/utils/injections/open-graph.html",
      type: "raw",
      injectTo: "head",
    });
  } else {
    deleteDirOrFile("src/utils/injections/open-graph.html");
  }
}
