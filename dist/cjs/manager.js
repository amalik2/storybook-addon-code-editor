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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const manager_api_1 = require("@storybook/manager-api");
// @ts-expect-error
const components_1 = require("@storybook/components");
const React = __importStar(require("react"));
const constants_1 = require("./constants");
const createStore_1 = require("./createStore");
const Editor_1 = __importDefault(require("./Editor/Editor"));
const store = (0, createStore_1.createStore)();
// @ts-expect-error
manager_api_1.addons.register(constants_1.addonId, (api) => {
    const getCodeEditorStoryId = () => api.getCurrentStoryData()?.parameters?.liveCodeEditor?.id;
    manager_api_1.addons.add(constants_1.panelId, {
        id: constants_1.addonId,
        title: 'Live code editor',
        type: manager_api_1.types.PANEL,
        disabled: () => !getCodeEditorStoryId(),
        // @ts-expect-error
        render({ active }) {
            const storyId = getCodeEditorStoryId();
            if (!active || !storyId) {
                return null;
            }
            const storyState = store.getValue(storyId);
            return (React.createElement(components_1.AddonPanel, { active: true },
                React.createElement(Editor_1.default, { ...storyState, onInput: (newCode) => {
                        store.setValue(storyId, { ...storyState, code: newCode });
                    }, value: storyState.code, parentSize: "100%" })));
        },
    });
});
