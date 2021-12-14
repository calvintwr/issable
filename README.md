>*Issable* -- Your Swiss Army Knife for runtime payload sanitisation and type-checking. 

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
        mobile: ['string', 'number']
    }

    const sanitised = is(payload)
        .exact()
        .statusCode(400) // error object will contain statusCode for API error response handling.
        .object(schema) // throws error if not matched, with details on mismatch with schema.

    // if check is passed, `sanitised` contains the sanitised object for use
    doSomethingWithPayload(sanitised)
})

// the above error will throw into Express/Fastify's error handler:
app.use(errorHandler)

function errorHandler(err, req, res) {
    res.statusCode = (error.statusCode) ? error.statusCode : 500
    
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
