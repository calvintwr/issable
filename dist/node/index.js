"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssableError = exports.define = exports.not = exports.is = void 0;
var you_are_not_1 = __importDefault(require("you-are-not"));
var NotTypeError_1 = __importDefault(require("you-are-not/dist/node/core/NotTypeError"));
exports.IssableError = NotTypeError_1.default;
/**
 * The main interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
var is = function (candidate, name) {
    if (name === void 0) { name = 'Anonymous param'; }
    var methods = {
        candidate: candidate,
        _name: name,
        throw: true,
        operator: 'is',
        _exact: false,
        _statusCode: 400,
        _msg: '',
        _checker: function (typing) {
            try {
                you_are_not_1.default.is(typing, this.candidate, this._name, this._msg);
            }
            catch (err) {
                if (this.throw === false)
                    return false;
                if (this.operator === 'not')
                    return true;
                this._errorModifier(err);
                throw err;
            }
            if (this.operator === 'is') {
                return true;
            }
            else if (this.operator === 'not') {
                if (this.throw === false)
                    return false;
                var err = new you_are_not_1.default.NotTypeError("".concat(this._name, " is of type ").concat(typing, "."));
                this._errorModifier(err);
                throw err;
            }
            else {
                throw Error('Fatal: Operator should only be `is` or `not`.');
            }
        },
        /** Check for string. */
        string: function () {
            return this._checker('string');
        },
        /** Check for `number`. NaN is not a `number`.*/
        number: function () {
            return this._checker('number');
        },
        /** Check for `array`. `Array` will not be `object`. */
        array: function () {
            return this._checker('array');
        },
        /** Check for `boolean`. */
        boolean: function () {
            return this._checker('boolean');
        },
        /** Check for `function`. */
        function: function () {
            return this._checker('function');
        },
        /** Check for `null`. `null` will not be object. */
        null: function () {
            return this._checker('null');
        },
        /** Check for `undefined`. */
        undefined: function () {
            return this._checker('undefined');
        },
        /** Check for `symbol`. */
        symbol: function () {
            return this._checker('symbol');
        },
        /** Check for `NaN`. */
        nan: function () {
            return this._checker('nan');
        },
        /** Check for `undefined` and `null`. */
        optional: function () {
            return this._checker('optional');
        },
        /** Check for `number` that is an integer and not float. */
        integer: function () {
            return this._checker('integer');
        },
        /**
         * Check for `object`. `Array` and `null` are not treated as object, and will fail this.
         * @param schema [Optional] Provide a schema to check. For example, { name: 'John', age: 20 } will pass schema { name: 'string' , age: 'number'}
         * For optionals in schema, denote with '?'. For e.g., { 'optionalKey?': 'boolean' }.
         * If a value can be expected to be in multiple types, denote using an array: For e.g, { 'multipleTypes': ['string', 'number'] }
         */
        object: function (schema) {
            if (typeof schema === 'undefined') {
                try {
                    return you_are_not_1.default.is('object', this.candidate, this._name, this._msg);
                }
                catch (err) {
                    if (this.throw === false)
                        return false;
                    this._errorModifier(err);
                    throw err;
                }
            }
            try {
                you_are_not_1.default.is('object', this.candidate);
                you_are_not_1.default.is('object', schema);
            }
            catch (err) {
                this._errorModifier(err);
                err.statusCode = 500;
                err.message = 'Internal error: Candidate or schema is not object.';
                throw err;
            }
            if (this.operator === 'is') {
                var result;
                try {
                    result = you_are_not_1.default.scrub(name || 'Anonymous Object', schema, candidate, this._exact);
                }
                catch (err) {
                    if (this.throw === false)
                        return false;
                    this._errorModifier(err);
                    throw err;
                }
                return result;
            }
            if (this.operator === 'not') {
                try {
                    you_are_not_1.default.scrub('', schema, candidate, true);
                }
                catch (err) {
                    // when it reaches here, it means the objects are not the same
                    // so means it is true.
                    return this.candidate;
                }
                if (this.throw === false)
                    return false;
                var err = new you_are_not_1.default.NotTypeError("Payload is not the same as defined schema for ".concat(this._name));
                this._errorModifier(err);
                throw err;
            }
        },
        /** Custom checks
         * @param typing The name of the custom check defined.
         */
        custom: function (typing) {
            return this._checker(typing);
        },
        /** Disable throwing of error. Will return false instead. */
        safe: function () {
            this.throw = false;
            return this;
        },
        /** Exact match for `object` check. */
        exact: function () {
            this._exact = true;
            return this;
        },
        /** Status code for API response. Will be returned in the `statusCode` property of the Error object thrown. */
        statusCode: function (code) {
            this._statusCode = code;
            return this;
        },
        /** Another syntax method. E.g, is(someVar).not().number() */
        not: function () {
            this.operator = 'not';
            return this;
        },
        /** Custom message if error is thrown. */
        msg: function (errorMessage) {
            this._msg = errorMessage;
            return this;
        },
        /** Name of parameter. An alternate way: is(someVar, 'fooPayLoad') is equivalent to is(someVar).name('fooPayload') */
        name: function (name) {
            this._name = name;
            return this;
        },
        _errorModifier: function (error) {
            error.statusCode = this._statusCode;
            if (this._msg && this._msg.length > 0) {
                var message = '';
                if (this._name)
                    message += "(Param: ".concat(this._name, ")");
                message += " ".concat(this._msg);
                error.message = message;
            }
            error.name = error.name.replace('(NotTS)', '(Issable)');
            return error;
        },
    };
    return methods;
};
exports.is = is;
/**
 * The inverted interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
var not = function (candidate, name) {
    var not = is(candidate, name);
    not.operator = 'not';
    return not;
};
exports.not = not;
/**
 * Define your own validation/checks.
 * @param options The options object.
 */
var define = function (options) {
    you_are_not_1.default.defineType({
        primitive: options.primitives,
        type: options.nameOfTyping,
        pass: options.toPass,
    });
};
exports.define = define;
exports.default = is;
