import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";

export function setBaseIcon(baseIcon) {
    if (!baseIcon) {
        deleteDirOrFile("src/utils/icons.ts");
        deleteDirOrFile("src/components/ui/BaseIcon.vue");
        deleteDirOrFile("src/assets/vue-icon.svg");
        replaceTextInFile(
            "src/main.ts",
            `import { loadIcons } from "@/utils/icons";\n`,
            "",
        );
        replaceTextInFile(
            "src/main.ts",
            "loadIcons();\n",
            "",
        );
        replaceTextInFile(
            "src/components/headers/SimpleHeader.vue",
            `import BaseIcon from "@/components/ui/BaseIcon.vue";\n`,
            ""
        );
        replaceTextInFile(
            "src/components/headers/SimpleHeader.vue",
            `<BaseIcon name="hamburger" class="drawer-toggle" @click="isDrawerOpen = !isDrawerOpen" />`,
            `<div @click="isDrawerOpen = !isDrawerOpen">
				<img src="@/assets/images/hamburger.svg" class="drawer-toggle"  />
			</div>`
        );
    } else {
    }
}