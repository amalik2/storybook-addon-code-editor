"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalModule = evalModule;
const standalone_1 = require("@babel/standalone");
function evalModule(moduleCode, availableImports) {
    const { code } = (0, standalone_1.transform)(moduleCode, {
        filename: 'index.tsx',
        presets: ['typescript', 'react'],
        plugins: ['transform-modules-commonjs'],
    });
    const setExports = new Function('require', 'exports', code);
    const require = (moduleId) => {
        const module = availableImports[moduleId];
        if (!module) {
            throw new TypeError(`Failed to resolve module specifier "${moduleId}"`);
        }
        return module;
    };
    const exports = {};
    setExports(require, exports);
    return exports;
}
