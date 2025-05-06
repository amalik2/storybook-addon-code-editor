export type EsModules = Record<string, Record<string, unknown>>;
export declare function evalModule(moduleCode: string, availableImports: EsModules): Record<string, unknown>;
