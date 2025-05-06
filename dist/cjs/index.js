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
exports.setupMonaco = void 0;
exports.createLiveEditStory = createLiveEditStory;
exports.makeLiveEditStory = makeLiveEditStory;
exports.Playground = Playground;
const React = __importStar(require("react"));
const createStore_1 = require("./createStore");
const Editor_1 = __importDefault(require("./Editor/Editor"));
const ErrorBoundary_1 = __importDefault(require("./ErrorBoundary"));
const Preview_1 = __importDefault(require("./Preview"));
var setupMonaco_1 = require("./Editor/setupMonaco");
Object.defineProperty(exports, "setupMonaco", { enumerable: true, get: function () { return setupMonaco_1.setupMonaco; } });
const store = (0, createStore_1.createStore)();
const hasReactRegex = /import\s+(\*\s+as\s+)?React[,\s]/;
const noop = () => { };
function LivePreview({ storyId, storyArgs }) {
    const [state, setState] = React.useState(store.getValue(storyId));
    const errorBoundaryResetRef = React.useRef(noop);
    const fullCode = hasReactRegex.test(state.code)
        ? state.code
        : "import * as React from 'react';" + state.code;
    React.useEffect(() => {
        return store.onChange(storyId, (newState) => {
            setState(newState);
            errorBoundaryResetRef.current();
        });
    }, [storyId]);
    return (React.createElement(ErrorBoundary_1.default, { resetRef: errorBoundaryResetRef },
        React.createElement(Preview_1.default, { availableImports: { react: React, ...state.availableImports }, code: fullCode, componentProps: storyArgs })));
}
/**
 * Returns a story with live editing capabilities.
 *
 * @deprecated Use the {@link makeLiveEditStory} function instead.
 */
function createLiveEditStory({ code, availableImports, modifyEditor, defaultEditorOptions, ...storyOptions }) {
    const id = `id_${Math.random()}`;
    store.setValue(id, { code, availableImports, modifyEditor, defaultEditorOptions });
    return {
        ...storyOptions,
        parameters: {
            ...storyOptions.parameters,
            liveCodeEditor: { disable: false, id },
            docs: {
                ...storyOptions.parameters?.docs,
                source: {
                    ...storyOptions.parameters?.docs?.source,
                    transform: (code) => store.getValue(id)?.code ?? code,
                },
            },
        },
        render: (props) => React.createElement(LivePreview, { storyId: id, storyArgs: props }),
    };
}
/**
 * Modifies a story to include a live code editor addon panel.
 */
function makeLiveEditStory(story, { code, availableImports, modifyEditor, defaultEditorOptions }) {
    const id = `id_${Math.random()}`;
    store.setValue(id, { code, availableImports, modifyEditor, defaultEditorOptions });
    story.parameters = {
        ...story.parameters,
        liveCodeEditor: { disable: false, id },
        docs: {
            ...story.parameters?.docs,
            source: {
                ...story.parameters?.docs?.source,
                transform: (code) => store.getValue(id)?.code ?? code,
            },
        },
    };
    story.render = (props) => React.createElement(LivePreview, { storyId: id, storyArgs: props });
}
const savedCode = {};
/**
 * React component containing a live code editor and preview.
 */
function Playground({ availableImports, code, height = '200px', id, Container, ...editorProps }) {
    let initialCode = code ?? '';
    if (id !== undefined) {
        savedCode[id] ??= initialCode;
        initialCode = savedCode[id];
    }
    const [currentCode, setCurrentCode] = React.useState(initialCode);
    const errorBoundaryResetRef = React.useRef(noop);
    const fullCode = hasReactRegex.test(currentCode)
        ? currentCode
        : "import * as React from 'react';" + currentCode;
    const editor = (React.createElement(Editor_1.default, { ...editorProps, onInput: (newCode) => {
            if (id !== undefined) {
                savedCode[id] = newCode;
            }
            setCurrentCode(newCode);
            errorBoundaryResetRef.current();
        }, value: currentCode }));
    const preview = (React.createElement(ErrorBoundary_1.default, { resetRef: errorBoundaryResetRef },
        React.createElement(Preview_1.default, { availableImports: { react: React, ...availableImports }, code: fullCode })));
    return Container ? (React.createElement(Container, { editor: editor, preview: preview })) : (React.createElement("div", { className: "sb-unstyled", style: { border: '1px solid #bebebe' } },
        React.createElement("div", { style: { margin: '16px 16px 0 16px', overflow: 'auto', paddingBottom: '16px' } }, preview),
        React.createElement("div", { style: { borderTop: '1px solid #bebebe', height, overflow: 'auto', resize: 'vertical' } }, editor)));
}
