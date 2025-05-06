import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import { getMonacoOverflowContainer } from './getMonacoOverflowContainer';
import { reactTypesLoader } from './reactTypesLoader';
import { getMonacoSetup } from './setupMonaco';
let monacoPromise;
function loadMonacoEditor() {
    const monacoSetup = getMonacoSetup();
    window.MonacoEnvironment = monacoSetup.monacoEnvironment;
    return (monacoPromise ||= Promise.all([reactTypesLoader()]).then(([reactTypes]) => {
        const monaco = Monaco;
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
        overflowWidgetsDomNode: getMonacoOverflowContainer('monacoOverflowContainer'),
        tabSize: 2,
        ...defaultEditorOptions,
    });
}
export default function Editor(props) {
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
