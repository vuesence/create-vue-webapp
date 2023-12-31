import fs from "node:fs";
import path from "node:path";
import { params } from "./params.js";

// function write(templateDir, file, content) {
//   const targetPath = path.join(projectRootDir, file);
//   if (content) {
//     fs.writeFileSync(targetPath, content);
//   } else {
//     copy(path.join(templateDir, file), targetPath);
//   }
// }

function writeToFile(file, content) {
  const targetPath = path.join(params.targetDirPath, file);
  fs.writeFileSync(targetPath, content);
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

// function isEmpty(path) {
//   const files = fs.readdirSync(path);
//   return files.length === 0 || (files.length === 1 && files[0] === ".git");
// }

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}
function deleteDirOrFile(pathToDelete) {
  pathToDelete = path.resolve(params.targetDirPath, pathToDelete);
  if (fs.existsSync(pathToDelete)) {
    const stats = fs.statSync(pathToDelete);
    if (stats.isDirectory()) {
      fs.readdirSync(pathToDelete).forEach((file) => {
        const filePath = path.join(pathToDelete, file);
        deleteDirOrFile(filePath);
      });
      fs.rmdirSync(pathToDelete);
    } else {
      fs.unlinkSync(pathToDelete);
    }
  }
}

function replaceTextInFile(filePath, searchValue, replaceValue) {
  try {
    filePath = path.resolve(params.targetDirPath, filePath);
    const data = fs.readFileSync(filePath, "utf8");
    const updatedData = data.replace(searchValue, replaceValue);
    fs.writeFileSync(filePath, updatedData, "utf8");
    // console.log("Text replaced successfully for '" + replaceValue + "'!");
  } catch (err) {
    console.error(err);
  }
}

function deleteTextInFile(filePath, strings) {
  try {
    filePath = path.resolve(params.targetDirPath, filePath);
    let data = fs.readFileSync(filePath, "utf8");
    strings.forEach((str) => {
      // console.log("removing: ", str);
      data = data.replace(str, "");
    });
    fs.writeFileSync(filePath, data, "utf8");
    // console.log("Text replaced successfully for '" + replaceValue + "'!");
  } catch (err) {
    console.error(err);
  }
}

export {
  // write,
  // copy,
  copyDir,
  emptyDir,
  writeToFile,
  deleteDirOrFile,
  deleteTextInFile,
  replaceTextInFile,
};
