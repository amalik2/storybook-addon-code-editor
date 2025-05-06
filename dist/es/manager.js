// @ts-expect-error
import { addons, types } from '@storybook/manager-api';
// @ts-expect-error
import { AddonPanel } from '@storybook/components';
import * as React from 'react';
import { addonId, panelId } from './constants';
import { createStore } from './createStore';
import Editor from './Editor/Editor';
const store = createStore();
// @ts-expect-error
addons.register(addonId, (api) => {
    const getCodeEditorStoryId = () => api.getCurrentStoryData()?.parameters?.liveCodeEditor?.id;
    addons.add(panelId, {
        id: addonId,
        title: 'Live code editor',
        type: types.PANEL,
        disabled: () => !getCodeEditorStoryId(),
        // @ts-expect-error
        render({ active }) {
            const storyId = getCodeEditorStoryId();
            if (!active || !storyId) {
                return null;
            }
            const storyState = store.getValue(storyId);
            return (React.createElement(AddonPanel, { active: true },
                React.createElement(Editor, { ...storyState, onInput: (newCode) => {
                        store.setValue(storyId, { ...storyState, code: newCode });
                    }, value: storyState.code, parentSize: "100%" })));
        },
    });
});
