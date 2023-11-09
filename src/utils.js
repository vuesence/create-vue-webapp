import fs from "node:fs";
import path from "node:path";
import {
	blue,
	cyan,
	green,
	lightBlue,
	lightGreen,
	lightRed,
	magenta,
	red,
	reset,
	yellow,
} from "kolorist";


function formatTargetDir(targetDir) {
	return targetDir?.trim().replace(/\/+$/g, "");
}


function isValidPackageName(projectName) {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName
	);
}

function write(templateDir, root, file, content) {
	// const targetPath = path.join(root, renameFiles[file] ?? file);
	const targetPath = path.join(root, file);
	if (content) {
		fs.writeFileSync(targetPath, content);
	} else {
		copy(path.join(templateDir, file), targetPath);
	}
};

function copy(src, dest) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}


function toValidPackageName(projectName) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
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

export { write, copy, isValidPackageName, toValidPackageName, isEmpty, emptyDir, formatTargetDir };