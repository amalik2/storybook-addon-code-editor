import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
export type EditorOptions = Monaco.editor.IEditorOptions;
interface EditorProps {
    onInput: (value: string) => any;
    value: string;
    modifyEditor?: (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => any;
    parentSize?: string;
    defaultEditorOptions?: EditorOptions;
}
export default function Editor(props: EditorProps): React.JSX.Element;
export {};
