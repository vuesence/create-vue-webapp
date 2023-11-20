import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";

export function setPwa(pwa) {
    // console.log("pwa", pwa);
    if (!pwa) {
        deleteDirOrFile("public/manifest.json");
        deleteDirOrFile("public/service-worker.js");
        replaceTextInFile(
            "index.html",
            "<!-- service-worker placeholder -->\n",
            ""
        );
    } else {
        replaceTextInFile(
            "index.html",
            "<!-- service-worker placeholder -->",
            `
		<script>
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.register("/service-worker.js");
			}
		</script>`
        );
    }
}