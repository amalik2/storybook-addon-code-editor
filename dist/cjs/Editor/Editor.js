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
exports.default = Editor;
const React = __importStar(require("react"));
const getMonacoOverflowContainer_1 = require("./getMonacoOverflowContainer");
const monacoLoader_1 = require("./monacoLoader");
const reactTypesLoader_1 = require("./reactTypesLoader");
const setupMonaco_1 = require("./setupMonaco");
let monacoPromise;
function loadMonacoEditor() {
    const monacoSetup = (0, setupMonaco_1.getMonacoSetup)();
    window.MonacoEnvironment = monacoSetup.monacoEnvironment;
    return (monacoPromise ||= Promise.all([(0, monacoLoader_1.monacoLoader)(), (0, reactTypesLoader_1.reactTypesLoader)()]).then(([monaco, reactTypes]) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
        });
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });
        reactTypes.forEach(([packageName, dTsFile]) => {
            const pName = packageName.replace('@types/', '');
            monaco.languages.typescript.typescriptDefaults.addExtraLib(dTsFile, `file:///node_modules/${pName}`);
        });
        monacoSetup.onMonacoLoad?.(monaco);
        return monaco;
    }));
}
let fileCount = 1;
function createEditor(monaco, code, container, defaultEditorOptions) {
    const uri = monaco.Uri.parse(`file:///index${fileCount++}.tsx`);
    return monaco.editor.create(container, {
        automaticLayout: true,
        fixedOverflowWidgets: true,
        model: monaco.editor.createModel(code, 'typescript', uri),
        overflowWidgetsDomNode: (0, getMonacoOverflowContainer_1.getMonacoOverflowContainer)('monacoOverflowContainer'),
        tabSize: 2,
        ...defaultEditorOptions,
    });
}
function Editor(props) {
    const stateRef = React.useRef({ onInput: props.onInput }).current;
    const [_, forceUpdate] = React.useReducer((n) => n + 1, 0);
    let resolveContainer = () => { };
    React.useState(() => {
        const containerPromise = new Promise((resolve) => {
            resolveContainer = resolve;
        });
        Promise.all([containerPromise, loadMonacoEditor()]).then(([editorContainer, monaco]) => {
            stateRef.monaco = monaco;
            stateRef.editor = createEditor(monaco, props.value, editorContainer, props.defaultEditorOptions);
            stateRef.editor.onDidChangeModelContent(() => {
                const currentValue = stateRef.editor?.getValue();
                if (typeof currentValue === 'string') {
                    stateRef.onInput(currentValue);
                }
            });
            forceUpdate();
        });
    });
    React.useLayoutEffect(() => {
        stateRef.onInput = props.onInput;
    }, [props.onInput]);
    React.useEffect(() => {
        if (stateRef.editor && stateRef.editor.getValue() !== props.value) {
            stateRef.editor.setValue(props.value);
        }
    }, [props.value]);
    React.useEffect(() => {
        if (stateRef.monaco && stateRef.editor) {
            props.modifyEditor?.(stateRef.monaco, stateRef.editor);
        }
    }, [stateRef.monaco, props.modifyEditor]);
    React.useEffect(() => {
        return () => {
            stateRef.editor?.dispose();
            stateRef.editor = undefined;
        };
    }, []);
    return (React.createElement("div", { ref: (container) => {
            if (props.parentSize) {
                const parent = container?.parentElement;
                if (parent) {
                    parent.style.height = props.parentSize;
                }
            }
            stateRef.editorContainer = container || undefined;
            resolveContainer(container);
        }, style: { height: '100%' }, className: "sb-unstyled" }));
}
