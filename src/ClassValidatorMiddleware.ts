/**
 * # Class Validator Middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import middy from '@middy/core';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import debugFactory, { IDebugger } from 'debug';
import { IMiddlewareOptions } from './interfaces/IMiddlewareOptions';

/** The actual middleware */
export class ClassValidatorMiddleware<T extends object>
  implements middy.MiddlewareObj<any, any, any> {
  public static create<S extends object> (
    options: IMiddlewareOptions<S>,
  ): ClassValidatorMiddleware<S> {
    return new ClassValidatorMiddleware(options);
  }

  /** The logger used in the module */
  private readonly logger: IDebugger;

  private readonly classType: ClassType<T>;

  private readonly validateQueryParamas: boolean;

  /** Creates a new JSON error handler middleware */
  constructor (options: IMiddlewareOptions<T>) {
    this.logger = debugFactory('middy-middleware-class-validator');
    this.logger('Setting up ClassValidatorMiddleware');
    (this.classType = options.classType),
      (this.validateQueryParamas = options.validateQueryParamas || false);
  }

  public before: middy.MiddlewareFn<any, any> = async (handler: middy.Request) => {
    try {
      if (this.validateQueryParamas) {
        const transformedQuery = await transformAndValidate(
          this.classType,
          handler.event.queryStringParameters as object,
        );

        handler.event.queryStringParameters = transformedQuery;
      } else {
        const transformedBody = await transformAndValidate(
          this.classType,
          handler.event.body as object,
        );

        handler.event.body = transformedBody;
      }
    } catch (error) {
      error.statusCode = 400;

      throw error;
    }
  };
}

export default ClassValidatorMiddleware.create;
