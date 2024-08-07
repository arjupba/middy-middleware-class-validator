/** @ignore */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
/* istanbul ignore next */
import { ValidationError } from 'class-validator';
import middleware from './ClassValidatorMiddleware';
import { IMiddlewareOptions } from './interfaces/IMiddlewareOptions';
/* istanbul ignore next */
export default middleware;
/* istanbul ignore next */
export * from './ClassValidatorMiddleware';
/* istanbul ignore next */
export * from './WithBody';
/* istanbul ignore next */
export * from './WithQuery';
export { ValidationError };
export { IMiddlewareOptions as ClassValidatorOptions };
