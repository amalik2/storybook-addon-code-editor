"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtraStaticDir = getExtraStaticDir;
exports.getCodeEditorStaticDirs = getCodeEditorStaticDirs;
const node_module_1 = require("node:module");
const node_path_1 = __importDefault(require("node:path"));
// Why not use `__filename` or `import.meta.filename`? Because this file gets compiled to both
// CommonJS and ES module. `import.meta.filename` is a syntax error in CommonJS and `__filename`
// is not available in ES modules. We can't use `import.meta.url` at all so we need a workaround.
function getFileNameFromStack() {
    const isWindows = process.platform === 'win32';
    const fullPathRegex = isWindows
        ? /[a-zA-Z]:\\.*\\getStaticDirs\.[cm]?js/
        : /\/.*\/getStaticDirs\.[cm]?js/;
    const match = fullPathRegex.exec(new Error().stack || '');
    if (!match) {
        throw new Error('Could not get the file path of storybook-addon-code-editor/getStaticDirs');
    }
    return match[0];
}
const filename = typeof __filename === 'string' ? __filename : getFileNameFromStack();
function resolve(reqFn, packageName) {
    try {
        return reqFn.resolve(`${packageName}/package.json`);
    }
    catch (err) {
        return reqFn.resolve(packageName);
    }
}
function resolvePackagePath(reqFn, packageName) {
    let error;
    let result;
    try {
        const packageEntryFile = resolve(reqFn, packageName);
        const namePosition = packageEntryFile.indexOf(`${node_path_1.default.sep}${packageName}${node_path_1.default.sep}`);
        if (namePosition === -1) {
            error = new Error(`Cannot resolve package path for: '${packageName}'.\nEntry file: ${packageEntryFile}`);
        }
        else {
            result = `${packageEntryFile.slice(0, namePosition)}${node_path_1.default.sep}${packageName}${node_path_1.default.sep}`;
        }
    }
    catch (err) {
        // Sometimes the require function can't find the entry file but knows the path.
        result =
            /Source path: (.+)/.exec(err?.message)?.[1] ||
                /main defined in (.+?)[\\/]package\.json/.exec(err?.message)?.[1];
        if (!result) {
            error = err;
        }
    }
    if (result) {
        return result;
    }
    throw error;
}
function getExtraStaticDir(specifier, relativeToFile = filename) {
    const specifierParts = specifier.split('/');
    const isScopedPackage = specifier.startsWith('@') && !!specifierParts[1];
    const pathParts = isScopedPackage ? specifierParts.slice(2) : specifierParts.slice(1);
    const packageName = isScopedPackage
        ? `${specifierParts[0]}/${specifierParts[1]}`
        : specifierParts[0];
    const require = (0, node_module_1.createRequire)(relativeToFile);
    const packageDir = resolvePackagePath(require, packageName);
    return {
        from: node_path_1.default.join(packageDir, ...pathParts),
        to: specifier,
    };
}
function tryGetStaticDir(packageName, relativeToFile) {
    try {
        return getExtraStaticDir(packageName, relativeToFile);
    }
    catch (err) { }
}
function getCodeEditorStaticDirs(relativeToFile) {
    const result = [getExtraStaticDir('monaco-editor/min', filename)];
    const reactTypesDir = tryGetStaticDir('@types/react', relativeToFile);
    if (reactTypesDir) {
        result.push(reactTypesDir);
    }
    return result;
}
