"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Preview;
const React = __importStar(require("react"));
const evalModule_1 = require("./evalModule");
const ErrorBoundary_1 = require("./ErrorBoundary");
function Preview({ availableImports, code, componentProps }) {
    let DefaultExport;
    try {
        DefaultExport = code ? (0, evalModule_1.evalModule)(code, availableImports).default : undefined;
        const isObject = DefaultExport && typeof DefaultExport === 'object';
        const isFunction = typeof DefaultExport === 'function';
        if (!isObject && !isFunction) {
            throw new TypeError('Default export is not a React component');
        }
    }
    catch (error) {
        return React.createElement("pre", { style: ErrorBoundary_1.errorStyle }, String(error));
    }
    return React.createElement(DefaultExport, { ...componentProps });
}
