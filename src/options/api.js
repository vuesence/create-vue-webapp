import { deleteTextInFile, deleteDirOrFile } from "../fs-utils.js";

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
    deleteTextInFile(
      "src/views/HomeView.vue",
      apiStrings.concat(jsonRpcStrings)
    );
  } else if (!jsonRpc) {
    deleteTextInFile("src/views/HomeView.vue", jsonRpcStrings);
  }
}
