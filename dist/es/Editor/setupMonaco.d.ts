import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
interface MonacoSetup {
    monacoEnvironment?: Monaco.Environment;
    onMonacoLoad?: (monaco: typeof Monaco) => any;
}
export declare function setupMonaco(options: MonacoSetup): void;
export declare function getMonacoSetup(): MonacoSetup;
export {};
