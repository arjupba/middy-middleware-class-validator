export type WithQuery<T, B> = T &
  Omit<T, 'queryStringParameters'> & { queryStringParameters: B };
