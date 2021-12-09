import Not from 'you-are-not'
import NotTypeError from 'you-are-not/dist/node/core/NotTypeError'

/**
 * The main interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
const is = (candidate: any, name: string = 'Anonymous param') => {
    const methods = {
        candidate,
        _name: name,
        throw: true,
        operator: 'is',
        _exact: false,
        _statusCode: 400,
        _msg: '',
        _checker(typing: string): boolean {
            try {
                Not.is(typing, this.candidate, this._name, this._msg)
            } catch (err: any) {
                if (this.throw === false) return false
                if (this.operator === 'not') return true
                this._errorModifier(err)
                throw err
            }

            if (this.operator === 'is') {
                return true
            } else if (this.operator === 'not') {
                if (this.throw === false) return false
                let err = new Not.NotTypeError(
                    `${this._name} is of type ${typing}.`,
                )
                this._errorModifier(err)
                throw err
            } else {
                throw Error('Fatal: Operator should only be `is` or `not`.')
            }
        },
        /** Check for string. */
        string(): boolean {
            return this._checker('string')
        },
        /** Check for `number`. NaN is not a `number`.*/
        number(): boolean {
            return this._checker('number')
        },
        /** Check for `array`. `Array` will not be `object`. */
        array(): boolean {
            return this._checker('array')
        },
        /** Check for `boolean`. */
        boolean(): boolean {
            return this._checker('boolean')
        },
        /** Check for `function`. */
        function(): boolean {
            return this._checker('function')
        },
        /** Check for `null`. `null` will not be object. */
        null(): boolean {
            return this._checker('null')
        },
        /** Check for `undefined`. */
        undefined(): boolean {
            return this._checker('undefined')
        },
        /** Check for `symbol`. */
        symbol(): boolean {
            return this._checker('symbol')
        },
        /** Check for `NaN`. */
        nan(): boolean {
            return this._checker('nan')
        },
        /** Check for `undefined` and `null`. */
        optional(): boolean {
            return this._checker('optional')
        },
        /** Check for `number` that is an integer and not float. */
        integer(): boolean {
            return this._checker('integer')
        },
        /** 
         * Check for `object`. `Array` and `null` are not treated as object, and will fail this. 
         * @param schema [Optional] Provide a schema to check. For example, { name: 'John', age: 20 } will pass schema { name: 'string' , age: 'number'}
         * For optionals in schema, denote with '?'. For e.g., { 'optionalKey?': 'boolean' }.
         * If a value can be expected to be in multiple types, denote using an array: For e.g, { 'multipleTypes': ['string', 'number'] }
         */
        object(schema?: object): any {
            if (typeof schema === 'undefined') {
                try {
                    return Not.is(
                        'object',
                        this.candidate,
                        this._name,
                        this._msg,
                    )
                } catch (err: any) {
                    if (this.throw === false) return false
                    this._errorModifier(err)
                    throw err
                }
            }

            try {
                Not.is('object', this.candidate)
                Not.is('object', schema)
            } catch (err: any) {
                this._errorModifier(err)
                err.statusCode = 500
                err.message = 'Internal error: Candidate or schema is not object.'
                throw err
            }

            if (this.operator === 'is') {
                var result
                try {
                    result = Not.scrub(
                        name || 'Anonymous Object',
                        schema,
                        candidate,
                        this._exact,
                    )
                } catch (err: any) {
                    if (this.throw === false) return false
                    this._errorModifier(err)
                    throw err
                }
                return result
            }

            if (this.operator === 'not') {
                try {
                    Not.scrub('', schema, candidate, true)
                } catch (err) {
                    // when it reaches here, it means the objects are not the same
                    // so means it is true.
                    return this.candidate
                }
                if (this.throw === false) return false
                let err = new Not.NotTypeError(
                    `Payload is not the same as defined schema for ${this._name}`,
                )
                this._errorModifier(err)
                throw err
            }
        },
        /** Custom checks
         * @param typing The name of the custom check defined.
         */
        custom(typing: string): boolean {
            return this._checker(typing)
        },
        /** Disable throwing of error. Will return false instead. */
        safe(): typeof this {
            this.throw = false
            return this
        },
        /** Exact match for `object` check. */
        exact(): typeof this {
            this._exact = true
            return this
        },
        /** Status code for API response. Will be returned in the `statusCode` property of the Error object thrown. */
        statusCode(code: number): typeof this {
            this._statusCode = code
            return this
        },
        /** Another syntax method. E.g, is(someVar).not().number() */
        not(): typeof this {
            this.operator = 'not'
            return this
        },
        /** Custom message if error is thrown. */
        msg(errorMessage: string) {
            this._msg = errorMessage
            return this
        },
        /** Name of parameter. An alternate way: is(someVar, 'fooPayLoad') is equivalent to is(someVar).name('fooPayload') */
        name(name: string) {
            this._name = name
            return this
        },
        _errorModifier(error: NotTypeError): NotTypeError {
            error.statusCode = this._statusCode

            if (this._msg && this._msg.length > 0) {
                let message = ''
                if (this._name) message += `(Param: ${this._name})`
                message += ` ${this._msg}`
                error.message = message
            }
            error.name = error.name.replace('(NotTS)', '(Issable)')
            return error
        },
    }

    return methods
}

/**
 * The inverted interface of Issable.
 * @param candidate The argument that you are checking.
 * @param name [Optional] Give the argument you are checking for a name.
 */
const not = (candidate: any, name?: string) => {
    const not = is(candidate, name)
    not.operator = 'not'
    return not
}

/**
 * Define your own validation/checks.
 * @param options The options object.
 */
const define = (options: {
    /** Define primitive types. For example, to allow both "100" and 100 to pass, write `[ 'string', 'number' ]`. */
    primitives: string | string[]
    /** Name of the typing, which will be made available via is(candidate).custom(nameOfTyping). */
    nameOfTyping: string
    /** The validation, pass/fail function. To return true or false. */
    toPass: (candidate: any) => boolean
}) => {
    Not.defineType({
        primitive: options.primitives,
        type: options.nameOfTyping,
        pass: options.toPass,
    })
}

export default is
export { is, not, define }
