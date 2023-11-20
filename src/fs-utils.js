import fs from "node:fs";
import path from "node:path";

let projectRootDir;

function setProjectRootDir(_projectRootDir) {
	projectRootDir = _projectRootDir;
}

function write(templateDir, file, content) {
	const targetPath = path.join(projectRootDir, file);
	if (content) {
		fs.writeFileSync(targetPath, content);
	} else {
		copy(path.join(templateDir, file), targetPath);
	}
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

function isEmpty(path) {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

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
	pathToDelete = path.resolve(projectRootDir, pathToDelete);
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
		filePath = path.resolve(projectRootDir, filePath);
		const data = fs.readFileSync(filePath, "utf8");
		const updatedData = data.replace(searchValue, replaceValue);
		fs.writeFileSync(filePath, updatedData, "utf8");
		// console.log("Text replaced successfully for '" + replaceValue + "'!");
	} catch (err) {
		console.error(err);
	}
}

export {
	write,
	copy,
	isEmpty,
	emptyDir,
	deleteDirOrFile,
	replaceTextInFile,
	setProjectRootDir
};
