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
    _exact: boolean;
    _statusCode: number;
    _msg: string;
    _checker(typing: string): boolean;
    /** Check for string. */
    string(): boolean;
    /** Check for `number`. NaN is not a `number`.*/
    number(): boolean;
    /** Check for `array`. `Array` will not be `object`. */
    array(): boolean;
    /** Check for `boolean`. */
    boolean(): boolean;
    /** Check for `function`. */
    function(): boolean;
    /** Check for `null`. `null` will not be object. */
    null(): boolean;
    /** Check for `undefined`. */
    undefined(): boolean;
    /** Check for `symbol`. */
    symbol(): boolean;
    /** Check for `NaN`. */
    nan(): boolean;
    /** Check for `undefined` and `null`. */
    optional(): boolean;
    /** Check for `number` that is an integer and not float. */
    integer(): boolean;
    /**
     * Check for `object`. `Array` and `null` are not treated as object, and will fail this.
     * @param schema [Optional] Provide a schema to check. For example, { name: 'John', age: 20 } will pass schema { name: 'string' , age: 'number'}
     * For optionals in schema, denote with '?'. For e.g., { 'optionalKey?': 'boolean' }.
     * If a value can be expected to be in multiple types, denote using an array: For e.g, { 'multipleTypes': ['string', 'number'] }
     */
    object(schema?: object | undefined): any;
    /** Custom checks
     * @param typing The name of the custom check defined.
     */
    custom(typing: string): boolean;
    /** Disable throwing of error. Will return false instead. */
    safe(): typeof this;
    /** Exact match for `object` check. */
    exact(): typeof this;
    /** Status code for API response. Will be returned in the `statusCode` property of the Error object thrown. */
    statusCode(code: number): typeof this;
    /** Another syntax method. E.g, is(someVar).not().number() */
    not(): typeof this;
    /** Custom message if error is thrown. */
    msg(errorMessage: string): any;
    /** Name of parameter. An alternate way: is(someVar, 'fooPayLoad') is equivalent to is(someVar).name('fooPayload') */
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
    _exact: boolean;
    _statusCode: number;
    _msg: string;
    _checker(typing: string): boolean;
    /** Check for string. */
    string(): boolean;
    /** Check for `number`. NaN is not a `number`.*/
    number(): boolean;
    /** Check for `array`. `Array` will not be `object`. */
    array(): boolean;
    /** Check for `boolean`. */
    boolean(): boolean;
    /** Check for `function`. */
    function(): boolean;
    /** Check for `null`. `null` will not be object. */
    null(): boolean;
    /** Check for `undefined`. */
    undefined(): boolean;
    /** Check for `symbol`. */
    symbol(): boolean;
    /** Check for `NaN`. */
    nan(): boolean;
    /** Check for `undefined` and `null`. */
    optional(): boolean;
    /** Check for `number` that is an integer and not float. */
    integer(): boolean;
    /**
     * Check for `object`. `Array` and `null` are not treated as object, and will fail this.
     * @param schema [Optional] Provide a schema to check. For example, { name: 'John', age: 20 } will pass schema { name: 'string' , age: 'number'}
     * For optionals in schema, denote with '?'. For e.g., { 'optionalKey?': 'boolean' }.
     * If a value can be expected to be in multiple types, denote using an array: For e.g, { 'multipleTypes': ['string', 'number'] }
     */
    object(schema?: object | undefined): any;
    /** Custom checks
     * @param typing The name of the custom check defined.
     */
    custom(typing: string): boolean;
    /** Disable throwing of error. Will return false instead. */
    safe(): typeof this;
    /** Exact match for `object` check. */
    exact(): typeof this;
    /** Status code for API response. Will be returned in the `statusCode` property of the Error object thrown. */
    statusCode(code: number): typeof this;
    /** Another syntax method. E.g, is(someVar).not().number() */
    not(): typeof this;
    /** Custom message if error is thrown. */
    msg(errorMessage: string): any;
    /** Name of parameter. An alternate way: is(someVar, 'fooPayLoad') is equivalent to is(someVar).name('fooPayload') */
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
export { is, not, define, NotTypeError as IssableError };
//# sourceMappingURL=index.d.ts.map