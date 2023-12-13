import { replaceTextInFile, deleteDirOrFile } from "../fs-utils.js";

export function setHeader(header) {
  if (header === "SlidingHeader") {
    replaceTextInFile(
      "src/layouts/MainLayout.vue",
      `import AppHeader from "@/components/headers/SimpleHeader.vue";`,
      `import AppHeaderContent from "@/components/headers/SimpleHeader.vue";
import AppHeader from "@/components/headers/SlidingHeader.vue";`
    );
    replaceTextInFile(
      "src/layouts/MainLayout.vue",
      "<AppHeader />",
      `
    <AppHeader :threshold-hide="200" :threshold-open="400">
      <template #first-header>
        <AppHeaderContent />
      </template>

      <template #second-header>
        <AppHeaderContent />
        <div style="margin-left: 45px">
          The second header
        </div>
      </template>
    </AppHeader>
        `
    );
    // } else {
    //     replaceTextInFile("src/layouts/MainLayout.vue", "SimpleFooter", footer);
  } else if (header !== "SimpleHeader") {
    replaceTextInFile(
      "src/layouts/MainLayout.vue",
      "/SimpleHeader.vue",
      "/" + header + ".vue"
    );
  }
}
