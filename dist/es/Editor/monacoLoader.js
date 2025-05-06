function injectScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
    });
}
export function monacoLoader() {
    const relativeLoaderScriptPath = 'monaco-editor/min/vs/loader.js';
    return injectScript(relativeLoaderScriptPath).then((e) => {
        const loaderScriptSrc = e.target?.src || window.location.origin + '/';
        const baseUrl = loaderScriptSrc.replace(relativeLoaderScriptPath, '');
        return new Promise((resolve) => {
            window.require.config({ paths: { vs: `${baseUrl}monaco-editor/min/vs` } });
            window.require(['vs/editor/editor.main'], resolve);
        });
    });
}
