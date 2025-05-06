import * as React from 'react';
import { EsModules } from './evalModule';
interface PreviewProps {
    availableImports: EsModules;
    code: string;
    componentProps?: any;
}
export default function Preview({ availableImports, code, componentProps }: PreviewProps): React.JSX.Element;
export {};
