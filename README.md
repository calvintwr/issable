>*Issable* -- Your Swiss Army Knife for runtime payload sanitisation and type-checking. Provides actionable error messges out-of-the-box.

There should be no learning curve for runtime payload sanitisation and type-checking. Issable is lightweight, readable, and highly extensible.

## Installation
```
npm install --save issable
```

## Usage

```ts
import { is } from 'issable'

is('foo').string() // returns true
is('foo').boolean() // Throws an error
```
Also supports CommonJS Require
```js
const { is, not, define } = require('issable')
```

## Intuitive style (ExpressJS and Fastify compatible)
Do away with vague, or troublesome error messaging/handling. One-size-fit-all example in using Issable with ExpressJS/Fastify:
```ts
app.get('/', (req, res, next) => {
    const payload = req.body
    const schema = {
        name: 'string',
        age: 'number',
        mobile: ['string', 'number'],
        "somethingOptional?": 'string'
    }

    const sanitised = is(payload)
        .exact()
        .statusCode(400) // Error instance will contain property `statusCode`. See #errorHandler, `error.statusCode` below.
        .object(schema) // throws error if not matched, with details on mismatch with schema.

    // if check is passed, `sanitised` contains the sanitised object for use
    doSomethingWithPayload(sanitised)
})

// the above error will throw into Express/Fastify's error handler:
app.use(errorHandler)

// import IssableError from issable module, and Request/Response from express/fastify
function errorHandler(err: IssableError, req: Request, res: Response) {
    res.statusCode = (err.statusCode) ? err.statusCode : 500
    
    res.locals.message = err.message
    res.locals.error = err
    
    res.send({
        success: false,
        ...res.locals
    })
}
```

Simple checks, and you can define our own error message:
```ts
function simpleAPIChecks(stringPayload, arrayPayload) {

    is(stringPayload, 'nameOfString')
        .msg('Invalid `string`.') // custom error message.
        .string()

    is(stringPayload, 'nameOfArray')
        .msg('Invalid `array`.')
        .string()

})
```

## Define your custom type

```ts
import { define } from 'issable'

    define({
        nameOfTyping: 'currency',
        primitives: ['string', 'number'], // could be string like '$10.00'

        // a function to return true or false
        toPass: (candidate: any) => {

            // $10.00, remove '$', check if can be parsed to a float.
            if (typeof candidate === 'string') {
                candidate = candidate.replace('$', '')
                return is(parseFloat(candidate)).safe().number()
            }

            // will be a number here, therefore will pass.
            return true
        },
    })
})
```

## #not

```ts
is(stringVar).not().boolean() // true

// is equivalent to

import { not } from 'issable'

not(stringVar).boolean() // true
not(stringVar).string() // throws error
```

## Available methods
**Checks**

`.string()` 

`.number()` 

`.array()` 

`.object()` 

`.function()` 

`.boolean()` 

`.null()` 

`.undefined()` 

`.symbol()` 

`.nan()`


**Others**

`.msg(string)` - Define your custom error message.

`.name(string)` - An alternative way to name your payload for error messages. `is(26, 'age').number()` is the same as `is(26).name('age').number()`.

`.statusCode(number)` - HTTP response status code. See example above.

`.not()` - `is(1).not().number()`.

`.exact()` - For use with comparing objects with schemas. See example above.

`.safe()` - Will not throw error. Used like `is(1).safe().string()`.

`.custom(nameOfCheck)` - Custom check. See example above.

## Negating Native JS Quirks
Some native JS quirks that constantly trips programmers and introduce bugs, are removed by Issable.
```js
typeof [] // object
is([]).object() // throws

typeof null // object
is(null).object() // throws

typeof NaN // number
is(NaN).number() // throws
is(NaN).nan() // true
```

