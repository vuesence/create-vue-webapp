import {
  replaceTextInFile,
  deleteTextInFile,
  deleteDirOrFile,
} from "../fs-utils.js";

const apiStrings = [
  'import { api } from "@/services/api";\n',
  'import { onMounted, ref } from "vue";\n',
  "const apiData = ref();\n",
  "onMounted(async () => {\n",
  "apiData.value = await api.tests.testRest();\n});",
  "<p><b>API data:</b> {{ apiData }}</p>\n",
];

const jsonRpcStrings = [
  "const jsonRpcData = ref();\n",
  "jsonRpcData.value = await api.utils.testJsonRpc();\n",
  "<p><b>JSON-RPC data:</b> {{ jsonRpcData }}</p>\n",
];

export function setApi(api, jsonRpc) {
  if (!api) {
    deleteDirOrFile("src/services/api");
    deleteTextInFile("src/main.ts", [
      `import { api } from "@/services/api";\n`,
      `api.init();\n`,
    ]);
  } else {
    // deleteTextInFile(
    //   "src/views/HomeView.vue",
    //   apiStrings.concat(jsonRpcStrings)
    // );
    replaceTextInFile(
      "src/views/HomeView.vue",
      `import { onMounted, ref } from "vue";`,
      `import { onMounted, ref } from "vue";\nimport { api } from "@/services/api";`
    );
    replaceTextInFile(
      "src/views/HomeView.vue",
      `// api-placeholder`,
      `const apiData = ref();

onMounted(async () => {
  apiData.value = await api.utils.testRest();
});`
    );
    replaceTextInFile(
      "src/views/HomeView.vue",
      `</ul>`,
      `</ul>\n<hr />\n<h3>API data:</h3> <p>{{ apiData }}</p>`
    );
    if (jsonRpc) {
      replaceTextInFile(
        "src/views/HomeView.vue",
        `const apiData = ref();`,
        `const apiData = ref();\nconst jsonRpcData = ref();`
      );
      replaceTextInFile(
        "src/views/HomeView.vue",
        `.testRest();`,
        `.testRest();\njsonRpcData.value = await api.utils.testJsonRpc();`
      );
      replaceTextInFile(
        "src/views/HomeView.vue",
        `<p>{{ apiData }}</p>`,
        `<p>{{ apiData }}</p>\n<hr />\n<h3>JSON-RPC data:</h3>\n<p class="json-rpc-data">\n{{ jsonRpcData }}\n</p>`
      );
      replaceTextInFile(
        "src/views/HomeView.vue",
        `</style>`,
        `</style>\n.json-rpc-data {
  max-width: 80vw;
  overflow-x: auto;
}`
      );
    }
  }
}
