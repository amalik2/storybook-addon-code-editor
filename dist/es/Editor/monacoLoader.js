function injectScript(url) {
    // @ts-expect-error
    const o = global.define;
    // @ts-expect-error
    global.define = undefined;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true;
        script.onload = (e) => {
            // @ts-expect-error
            global.define = o;
            resolve(e);
        };
        script.onerror = reject;
        document.head.append(script);
    });
}
export function monacoLoader() {
    const relativeLoaderScriptPath = 'monaco-editor/min/vs/loader.js';
    return injectScript(relativeLoaderScriptPath).then((e) => {
        // @ts-expect-error
        const loaderScriptSrc = e.target?.src || window.location.origin + '/';
        const baseUrl = loaderScriptSrc.replace(relativeLoaderScriptPath, '');
        return new Promise((resolve) => {
            window.require.config({ paths: { vs: `${baseUrl}monaco-editor/min/vs` } });
            window.require(['vs/editor/editor.main'], resolve);
        });
    });
}
