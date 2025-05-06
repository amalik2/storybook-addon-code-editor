import * as React from 'react';
import { evalModule } from './evalModule';
import { errorStyle } from './ErrorBoundary';
export default function Preview({ availableImports, code, componentProps }) {
    let DefaultExport;
    try {
        DefaultExport = code ? evalModule(code, availableImports).default : undefined;
        const isObject = DefaultExport && typeof DefaultExport === 'object';
        const isFunction = typeof DefaultExport === 'function';
        if (!isObject && !isFunction) {
            throw new TypeError('Default export is not a React component');
        }
    }
    catch (error) {
        return React.createElement("pre", { style: errorStyle }, String(error));
    }
    return React.createElement(DefaultExport, { ...componentProps });
}
