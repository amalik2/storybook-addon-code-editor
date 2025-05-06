// This provides shared state and the ability to subscribe to changes
// between the manager and preview iframes.
// Attempted to use Storybook's `addons.getChannel()` but it doesn't emit
// across iframes.
function newStore(initialValue) {
    const callbacks = new Set();
    let value = initialValue;
    return {
        onChange(callback) {
            callbacks.add(callback);
            return () => {
                callbacks.delete(callback);
            };
        },
        getValue: () => value,
        setValue(newValue) {
            value = newValue;
            callbacks.forEach((callback) => {
                try {
                    callback(newValue);
                }
                catch (error) {
                    console.error(error);
                }
            });
        },
    };
}
function newKeyStore() {
    const stores = {};
    return {
        onChange: (key, callback) => (stores[key] ||= newStore()).onChange(callback),
        getValue: (key) => (stores[key] ||= newStore()).getValue(),
        setValue: (key, newValue) => (stores[key] ||= newStore()).setValue(newValue),
    };
}
export function createStore() {
    const getStore = (managerWindow) => (managerWindow._addon_code_editor_store ||= newKeyStore());
    try {
        // This will throw in the manager if the storybook site is in an iframe.
        return getStore(window.parent);
    }
    catch {
        return getStore(window);
    }
}
