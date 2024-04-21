import { ClassType, TransformValidationOptions } from 'class-transformer-validator';

export interface IMiddlewareOptions<T extends object> {
  classType?: ClassType<T>;
  bodyClassType?: ClassType<T>;
  queryClassType?: ClassType<T>;
  bodyValidationOptions?: TransformValidationOptions;
  queryValidationOptions?: TransformValidationOptions;
}

export function isMiddlewareOptions (options: any): options is IMiddlewareOptions<any> {
  return !!(options && options.classType);
}
