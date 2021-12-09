"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = exports.not = exports.is = void 0;
var you_are_not_1 = __importDefault(require("you-are-not"));
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
        exact: false,
        _statusCode: 400,
        _msg: '',
        _checker: function (typing) {
            try {
                you_are_not_1.default.is(typing, this.candidate, this._name, this._msg);
            }
            catch (err) {
                if (this.operator === 'not')
                    return true;
                this._errorModifier(err);
                throw err;
            }
            if (this.operator === 'is') {
                return true;
            }
            else if (this.operator === 'not') {
                var err = new you_are_not_1.default.NotTypeError("".concat(this._name, " is of type ").concat(typing, "."));
                this._errorModifier(err);
                throw err;
            }
            else {
                throw Error('Fatal: Operator should only be `is` or `not`.');
            }
        },
        string: function () {
            return this._checker('string');
        },
        number: function () {
            return this._checker('number');
        },
        array: function () {
            return this._checker('array');
        },
        boolean: function () {
            return this._checker('boolean');
        },
        function: function () {
            return this._checker('function');
        },
        null: function () {
            return this._checker('null');
        },
        undefined: function () {
            return this._checker('undefined');
        },
        symbol: function () {
            return this._checker('symbol');
        },
        nan: function () {
            return this._checker('nan');
        },
        optional: function () {
            return this._checker('optional');
        },
        integer: function () {
            return this._checker('integer');
        },
        object: function (schema) {
            if (typeof schema === 'undefined') {
                try {
                    return you_are_not_1.default.is('object', this.candidate, this._name, this._msg);
                }
                catch (err) {
                    this._errorModifier(err);
                    throw err;
                }
            }
            try {
                you_are_not_1.default.is('object', this.candidate);
                you_are_not_1.default.is('object', schema);
            }
            catch (err) {
                // TODO: modify
                throw err;
            }
            if (this.operator === 'is') {
                var result;
                try {
                    result = you_are_not_1.default.scrub(name || 'Anonymous Object', schema, candidate, this.exact);
                }
                catch (err) {
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
                var err = new you_are_not_1.default.NotTypeError("Payload is not the same as defined schema for ".concat(this._name));
                this._errorModifier(err);
                throw err;
            }
        },
        custom: function (typing) {
            return this._checker(typing);
        },
        safe: function () {
            this.throw = false;
            return this;
        },
        statusCode: function (code) {
            this._statusCode = code;
            return this;
        },
        not: function () {
            this.operator = 'not';
            return this;
        },
        msg: function (errorMessage) {
            this._msg = errorMessage;
            return this;
        },
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
        }
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
        pass: options.toPass
    });
};
exports.define = define;
exports.default = is;
