# middy-class-validator-middleware

A [middy](https://github.com/middyjs/middy) middleware that returns errors as http errors, compatible with [http-errors](https://www.npmjs.com/package/http-errors).

This module is forked from `https://github.com/dbartholomae/middy-middleware-class-validator`. Thanks @Daniel (https://www.npmjs.com/~dbartholomae)
This module will be deleted once Daniel approved and merge additional features to the parent.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install middy-class-validator-middleware --save
```

## Usage for body params

```typescript
// When using decorators, don't forget to import this in the very first line of code
import 'reflect-metadata';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { IsString } from 'class-validator';
import middy from '@middy/core';
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler';

import ClassValidatorMiddleware, { WithBody } from 'middy-class-validator-middleware';

// Define a validator for the body via class-validator
class NameBody {
  public firstName: string;

  public lastName: string;
}

// This is your AWS handler
async function helloWorld (event: WithBody<APIGatewayProxyEvent, NameBody>) {
  // Thanks to the validation middleware you can be sure body is typed correctly
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      'content-type': 'text',
    },
    statusCode: 200,
  };
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(
    ClassValidatorMiddleware({
      // Add the validation class here
      classType: NameBody,
    }),
  )
  // The class validator throws validation errors from http-errors which are compatible with
  // the error handler middlewares for middy
  .use(JSONErrorHandlerMiddleware());
```

## Usage for query params

```typescript
// When using decorators, don't forget to import this in the very first line of code
import 'reflect-metadata';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { IsString } from 'class-validator';
import middy from '@middy/core';
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler';

import ClassValidatorMiddleware, { WithQuery } from 'middy-class-validator-middleware';

// Define a validator for the body via class-validator
class NameBody {
  public firstName: string;

  public lastName: string;
}

// This is your AWS handler
async function helloWorld (event: WithQuery<APIGatewayProxyEvent, NameBody>) {
  // Thanks to the validation middleware you can be sure queryStringParameters is typed correctly
  return {
    queryStringParameters: `Hello ${event.queryStringParameters.firstName} ${event.queryStringParameters.lastName}`,
    headers: {
      'content-type': 'text',
    },
    statusCode: 200,
  };
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(
    ClassValidatorMiddleware({
      // Add the validation class here
      queryClassType: NameBody,
      queryValidationOptions: {
        validator: { whitelist: true, forbidNonWhitelisted: false },
      },
    }),
  )
  // The class validator throws validation errors from http-errors which are compatible with
  // the error handler middlewares for middy
  .use(JSONErrorHandlerMiddleware());
```
