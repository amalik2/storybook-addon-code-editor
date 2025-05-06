import * as React from 'react';
import { createStore } from './createStore';
import Editor from './Editor/Editor';
import ErrorBoundary from './ErrorBoundary';
import Preview from './Preview';
export { setupMonaco } from './Editor/setupMonaco';
const store = createStore();
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
    return (React.createElement(ErrorBoundary, { resetRef: errorBoundaryResetRef },
        React.createElement(Preview, { availableImports: { react: React, ...state.availableImports }, code: fullCode, componentProps: storyArgs })));
}
/**
 * Returns a story with live editing capabilities.
 *
 * @deprecated Use the {@link makeLiveEditStory} function instead.
 */
export function createLiveEditStory({ code, availableImports, modifyEditor, defaultEditorOptions, ...storyOptions }) {
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
export function makeLiveEditStory(story, { code, availableImports, modifyEditor, defaultEditorOptions }) {
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
export function Playground({ availableImports, code, height = '200px', id, Container, ...editorProps }) {
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
    const editor = (React.createElement(Editor, { ...editorProps, onInput: (newCode) => {
            if (id !== undefined) {
                savedCode[id] = newCode;
            }
            setCurrentCode(newCode);
            errorBoundaryResetRef.current();
        }, value: currentCode }));
    const preview = (React.createElement(ErrorBoundary, { resetRef: errorBoundaryResetRef },
        React.createElement(Preview, { availableImports: { react: React, ...availableImports }, code: fullCode })));
    return Container ? (React.createElement(Container, { editor: editor, preview: preview })) : (React.createElement("div", { className: "sb-unstyled", style: { border: '1px solid #bebebe' } },
        React.createElement("div", { style: { margin: '16px 16px 0 16px', overflow: 'auto', paddingBottom: '16px' } }, preview),
        React.createElement("div", { style: { borderTop: '1px solid #bebebe', height, overflow: 'auto', resize: 'vertical' } }, editor)));
}
