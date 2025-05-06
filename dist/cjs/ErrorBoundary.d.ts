import * as React from 'react';
interface ErrorBoundaryProps {
    resetRef: React.MutableRefObject<(() => void) | undefined>;
    children: React.ReactNode;
}
export declare const errorStyle: {
    backgroundColor: string;
    borderRadius: string;
    color: string;
    fontFamily: string;
    margin: string;
    padding: string;
};
declare class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state: {
        error: undefined;
    };
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: unknown): {
        error: unknown;
    };
    render(): string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element | null | undefined;
}
export default ErrorBoundary;
