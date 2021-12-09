import NotTypeError from "you-are-not/dist/node/core/NotTypeError";
interface isMethodsType {
    candidate: string;
    _name: string;
    throw: boolean;
    operator: 'is' | 'not';
    exact: boolean;
    _statusCode: number;
    _msg: string;
    _checker: (typing: string) => boolean;
    string: () => boolean;
    number: () => boolean;
    array: () => boolean;
    boolean: () => boolean;
    function: () => boolean;
    null: () => boolean;
    undefined: () => boolean;
    symbol: () => boolean;
    nan: () => boolean;
    optional: () => boolean;
    integer: () => boolean;
    object: (schema?: object) => any;
    safe: () => this;
    statusCode: (code: number) => this;
    not: () => this;
    msg: (errorMessage: string) => this;
    name: (name: string) => this;
    _errorModifier: (error: NotTypeError) => NotTypeError;
    custom: (typing: string) => boolean;
}
export default isMethodsType;
//# sourceMappingURL=isMethodsType.d.ts.map