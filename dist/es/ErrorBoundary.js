import * as React from 'react';
export const errorStyle = {
    backgroundColor: '#f8d7da',
    borderRadius: '5px',
    color: '#721c24',
    fontFamily: 'monospace',
    margin: '0',
    padding: '20px',
};
class ErrorBoundary extends React.Component {
    state = { error: undefined };
    constructor(props) {
        super(props);
        this.props.resetRef.current = this.setState.bind(this, this.state);
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return React.createElement("pre", { style: errorStyle }, String(this.state.error));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
