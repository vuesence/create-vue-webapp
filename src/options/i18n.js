import {
  deleteDirOrFile,
  replaceTextInFile,
  deleteTextInFile,
} from "../fs-utils.js";
import { params } from "../params.js";

export function setI18n(i18n) {
  if (i18n) {
    replaceTextInFile(
      "src/main.ts",
      "// i18n placeholder 1",
      `import { useI18n } from "@/composables/useI18nLight";\n\nconst { initI18n } = useI18n();`
    );
    replaceTextInFile("src/main.ts", "// i18n placeholder 2", "initI18n();");
    replaceTextInFile(
      "src/views/HomeView.vue",
      "// i18n placeholder 1",
      `import { useI18n } from "@/composables/useI18nLight";
      
const { t, locales, locale, setLocale } = useI18n();

function changeLocale() {
  setLocale(locales.find(l => l.code != locale.value.code).code);
}`
    );
    replaceTextInFile(
      "src/views/HomeView.vue",
      "<!-- i18n placeholder 2 -->",
      `<div>
      i18n test -
      <button
        type="button"
        @click="changeLocale()"
      >
        {{ t('msg') }} ({{ locale.code }})
      </button>
    </div>`
    );
    replaceTextInFile("src/main.ts", "// i18n placeholder 2", "initI18n();");
  } else {
    deleteTextInFile("src/main.ts", [
      "// i18n placeholder 1\n",
      "// i18n placeholder 2\n",
    ]);
    deleteTextInFile("src/views/HomeView.vue", [
      "// i18n placeholder 1\n",
      "<!-- i18n placeholder 2 -->\n",
    ]);
    deleteDirOrFile("src/utils/locales");
    deleteDirOrFile("src/composables/useI18nLight.ts");
  }
}
