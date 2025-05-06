type Callback<T> = (newValue: T) => any;
interface KeyStore<T> {
    onChange(key: string, callback: Callback<T>): () => void;
    getValue(key: string): T | undefined;
    setValue(key: string, newValue: T): void;
}
export declare function createStore<T>(): KeyStore<T>;
export {};
