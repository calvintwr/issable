import NotTypeError from 'you-are-not/dist/node/core/NotTypeError';
/**
 * The main interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
declare const is: (candidate: any, name?: string) => {
    candidate: any;
    _name: string;
    throw: boolean;
    operator: string;
    exact: boolean;
    _statusCode: number;
    _msg: string;
    _checker(typing: string): boolean;
    string(): boolean;
    number(): boolean;
    array(): boolean;
    boolean(): boolean;
    function(): boolean;
    null(): boolean;
    undefined(): boolean;
    symbol(): boolean;
    nan(): boolean;
    optional(): boolean;
    integer(): boolean;
    object(schema?: object | undefined): any;
    custom(typing: string): boolean;
    safe(): typeof this;
    statusCode(code: number): typeof this;
    not(): typeof this;
    msg(errorMessage: string): any;
    name(name: string): any;
    _errorModifier(error: NotTypeError): NotTypeError;
};
/**
 * The inverted interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
declare const not: (candidate: any, name?: string | undefined) => {
    candidate: any;
    _name: string;
    throw: boolean;
    operator: string;
    exact: boolean;
    _statusCode: number;
    _msg: string;
    _checker(typing: string): boolean;
    string(): boolean;
    number(): boolean;
    array(): boolean;
    boolean(): boolean;
    function(): boolean;
    null(): boolean;
    undefined(): boolean;
    symbol(): boolean;
    nan(): boolean;
    optional(): boolean;
    integer(): boolean;
    object(schema?: object | undefined): any;
    custom(typing: string): boolean;
    safe(): typeof this;
    statusCode(code: number): typeof this;
    not(): typeof this;
    msg(errorMessage: string): any;
    name(name: string): any;
    _errorModifier(error: NotTypeError): NotTypeError;
};
/**
 * Define your own validation/checks.
 * @param options The options object.
 */
declare const define: (options: {
    /** Define primitive types. For example, to allow both "100" and 100 to pass, write `[ 'string', 'number' ]`. */
    primitives: string | string[];
    /** Name of the typing, which will be made available via is(candidate).custom(nameOfTyping). */
    nameOfTyping: string;
    /** The validation, pass/fail function. To return true or false. */
    toPass: (candidate: any) => boolean;
}) => void;
export default is;
export { is, not, define };
//# sourceMappingURL=index.d.ts.map