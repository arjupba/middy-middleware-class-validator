import { ClassType } from 'class-transformer-validator';

export interface IMiddlewareOptions<T extends object> {
  classType: ClassType<T>;
  validateQueryParamas?: boolean;
}

export function isMiddlewareOptions (options: any): options is IMiddlewareOptions<any> {
  return !!(options && options.classType);
}
