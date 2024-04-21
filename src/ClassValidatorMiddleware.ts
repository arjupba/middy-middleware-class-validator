/**
 * # Class Validator Middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import middy from '@middy/core';
import {
  ClassType,
  transformAndValidate,
  TransformValidationOptions,
} from 'class-transformer-validator';
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

  private readonly bodyClassType: ClassType<T> | undefined;
  private readonly queryClassType: ClassType<T> | undefined;

  private readonly bodyValidationOptions: TransformValidationOptions | undefined;
  private readonly queryValidationOptions: TransformValidationOptions | undefined;

  /** Creates a new JSON error handler middleware */
  constructor (options: IMiddlewareOptions<T>) {
    this.logger = debugFactory('middy-class-validator-middleware');
    this.logger('Setting up ClassValidatorMiddleware');
    this.bodyClassType = options.classType || options.bodyClassType;
    this.queryClassType = options.queryClassType;
    this.bodyValidationOptions = options.bodyValidationOptions;
    this.queryValidationOptions = options.queryValidationOptions;
  }

  public before: middy.MiddlewareFn<any, any> = async (handler: middy.Request) => {
    try {
      if (this.queryClassType) {
        const transformedQuery = await transformAndValidate(
          this.queryClassType,
          handler.event.queryStringParameters as object,
          this.queryValidationOptions,
        );
        handler.event.queryStringParameters = transformedQuery;
      }

      if (this.bodyClassType) {
        const transformedBody = await transformAndValidate(
          this.bodyClassType,
          handler.event.body as object,
          this.bodyValidationOptions,
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
