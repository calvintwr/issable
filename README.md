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

## Intuitive style
```ts

function apiReceivingDate(payload) {

    const schema = {
        name: 'string',
        age: 'number',
        mobile: ['string', 'number']
    }

    const sanitised = is(payload)
        .exact()
        .statusCode(500) // error object will contain statusCode for API error response handling.
        .object(schema) // throws error if not matched, with details on mismatch with schema.

    // if check is passed, `sanitised` contains the sanitised object for use
    doSomethingWithPayload(sanitised)

}

function simpleAPIChecks(stringPayload, arrayPayload) {

    is(stringPayload, 'nameOfString')
        .msg('Invalid `string`.') // custom error message.
        .string()

    is(stringPayload, 'nameOfArray')
        .msg('Invalid `array`.')
        .string()

}
```

## #not

```ts
is(stringVar).not().boolean() // true
// is equivalent to

import { not } from 'issable'

not(stringVar).boolean() // true
not(stringVar).string() // throws error
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
    
```
