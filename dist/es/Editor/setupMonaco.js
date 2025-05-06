import { createStore } from '../createStore';
const store = createStore();
export function setupMonaco(options) {
    store.setValue('monacoSetup', options);
}
export function getMonacoSetup() {
    return store.getValue('monacoSetup') || {};
}
