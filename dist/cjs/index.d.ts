import * as React from 'react';
import Editor, { EditorOptions } from './Editor/Editor';
export { setupMonaco } from './Editor/setupMonaco';
export interface StoryState {
    code: string;
    availableImports?: Record<string, Record<string, unknown>>;
    modifyEditor?: React.ComponentProps<typeof Editor>['modifyEditor'];
    defaultEditorOptions?: EditorOptions;
}
type AnyFn = (...args: any[]) => unknown;
type MinimalStoryObj = {
    parameters?: {
        liveCodeEditor?: {
            disable: boolean;
            id: string;
        };
        docs?: {
            source?: Record<PropertyKey, unknown>;
        };
    };
    render?: AnyFn;
};
type MinimalStory = MinimalStoryObj | (AnyFn & MinimalStoryObj);
/**
 * Returns a story with live editing capabilities.
 *
 * @deprecated Use the {@link makeLiveEditStory} function instead.
 */
export declare function createLiveEditStory<T extends MinimalStory>({ code, availableImports, modifyEditor, defaultEditorOptions, ...storyOptions }: StoryState & T): T;
/**
 * Modifies a story to include a live code editor addon panel.
 */
export declare function makeLiveEditStory<T extends MinimalStory>(story: T, { code, availableImports, modifyEditor, defaultEditorOptions }: StoryState): void;
/**
 * React component containing a live code editor and preview.
 */
export declare function Playground({ availableImports, code, height, id, Container, ...editorProps }: Partial<StoryState> & {
    height?: string;
    id?: string;
    Container?: React.ComponentType<{
        editor: React.ReactNode;
        preview: React.ReactNode;
    }>;
}): React.JSX.Element;
