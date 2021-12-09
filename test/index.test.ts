import { describe } from 'mocha'
import { should } from 'chai'
import { is, not, define } from '../src/index'
import Not from 'you-are-not'

const { NotTypeError } = Not

should()

describe('Boolean test - is', () => {
    it('should return true for comparing with bool true', () => {
        is(true).boolean().should.be.true
    })

    it('should return true for comparing with bool false', () => {
        is(false).boolean().should.be.true
    })

    it('should throw error for comparing with non-boolean', () => {
        ;(() => {
            is(1).boolean()
        }).should.Throw(
            NotTypeError,
            'Wrong Type (Anonymous param): Expecting type `boolean` but got `number` with value of `1`.',
        )
    })
})

describe('Boolean test - not', () => {
    it('should not throw error (return true) for comparing with non-bool', () => {
        not('someString').boolean().should.be.true
    })

    it('should return true for comparing with bool false', () => {
        is(false).boolean().should.be.true
    })

    it('should throw error for comparing with non-boolean', () => {
        ;(() => {
            is(1).boolean()
        }).should.Throw(
            NotTypeError,
            'Wrong Type (Anonymous param): Expecting type `boolean` but got `number` with value of `1`',
        )
    })
})

describe('Number test - with #safe', () => {
    it('should return false using #is to compare `false` to `number`', () => {
        is(false).safe().number().should.be.false
    })

    it('should return false using #not to compare `string` to `bool`', () => {
        not('someString').safe().boolean().should.be.false
    })
})

describe('Object test', () => {
    it('should be able to check if something is object', () => {
        is({}).object().should.be.true
    })

    it('should return object for comparing with correct schema', () => {
        is({
            foo: {
                bar: 1,
            },
        })
            .object({
                foo: {
                    bar: 'number',
                },
            })
            .should.deep.include({ foo: { bar: 1 } })
    })

    it('should return object for comparing with correct schema (exact = true)', () => {
        is({
            foo: {
                bar: 1,
            },
        })
            .exact()
            .object({
                foo: {
                    bar: 'number',
                },
            })
            .should.deep.include({ foo: { bar: 1 } })
    })

    it('should throw if schema don\'t match exactly (exact = true)', () => {
        var error: any
        ;(() => {
            try {
                is({
                    foo: {
                        bar: 1,
                    },
                    additionalKey: 'not required',
                }).exact().msg('Payload and schema don\'t match.')
                    .object({
                        foo: {
                            bar: 'number',
                        },
                    })
            } catch (err: any) {
                error = err
                throw error
            }
        }).should.Throw(NotTypeError, 'Payload and schema don\'t match.')
        error!.trace.should.have.length(1).include.members(['Property `Anonymous param.additionalKey` exists but is not expected.'])
    })

    it('should return sanitised object', () => {
        is({
            foo: {
                bar: 1,
            },
            additionalKey: 'not required',
        })
            .object({
                foo: {
                    bar: 'number',
                },
            })
            .should.deep.include({ foo: { bar: 1 } })
            .should.not.deep.include({ additionalKey: 'not required ' })
    })

    it('should return sanitised object', () => {
        is({
            foo: {
                bar: 1,
            },
            additionalKey: 'not required',
        })
            .object({
                foo: {
                    bar: 'number',
                },
            })
            .should.deep.include({ foo: { bar: 1 } })
            .should.not.deep.include({ additionalKey: 'not required ' })
    })
})

describe('Status code', () => {
    it('should set status code', () => {
        is(true).statusCode(555)._statusCode.should.equal(555)
    })

    it('should throw error with set status code', () => {
        var error
        try {
            is(1, 'foo').statusCode(666).boolean()
        } catch (err: any) {
            error = err
        }
        error.statusCode.should.equal(666)
    })
})

describe('Custom messaging', () => {
    it('should have custom message', () => {
        ;(() => {
            is([], 'FooFoo').msg('You need to provide an object.').object()
        }).should.Throw(
            NotTypeError,
            '(Param: FooFoo) You need to provide an object.',
        )
    })

    it('should have custom message', () => {
        ;(() => {
            not('string', 'FooFoo').msg('It must not be string.').string()
        }).should.Throw(NotTypeError, '(Param: FooFoo) It must not be string.')
    })

    it('should throw error with set status code', () => {
        var error
        try {
            is(1, 'foo').statusCode(666).boolean()
        } catch (err: any) {
            error = err
        }
        error.statusCode.should.equal(666)
    })
})

describe('Define new checks', () => {
    it('should be able to define new checks/types', () => {
        define({
            primitives: ['string', 'boolean'],
            nameOfTyping: 'truthy',
            toPass: (candidate: any) => {
                if (candidate === 'true') return true
                if (candidate === true) return true
                return false
            },
        })

        is('true').custom('truthy').should.be.true
        ;(() => {
            is([]).custom('truthy')
        }).should.Throw(
            NotTypeError,
            'Wrong Type (Anonymous param): Expecting type `custom:truthy` but got `array` with value of `[]`.',
        )

        not(1).custom('truthy').should.be.true
        ;(() => {
            not(true).custom('truthy')
        }).should.Throw(NotTypeError, 'Anonymous param is of type truthy.')
    })
})
