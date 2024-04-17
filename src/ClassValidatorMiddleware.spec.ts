import classValidatorMiddleware from './ClassValidatorMiddleware';

import { Context } from 'aws-lambda';
import { IsString } from 'class-validator';

class NameBody {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

describe('ClassValidatorMiddleware', () => {
  describe('before hook with body params', () => {
    describe('with valid input', () => {
      const body = JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
      });

      it('sets the body to the transformed and validated value', async () => {
        const handler = {
          context: {} as Context,
          error: {} as Error,
          event: { body },
          internal: jest.fn(),
          response: {},
        };
        await classValidatorMiddleware({
          classType: NameBody,
        }).before(handler);
        expect(handler.event.body).toEqual({
          firstName: 'John',
          lastName: 'Doe',
        });
      });
    });

    describe('with invalid input', () => {
      const body = JSON.stringify({
        firstName: 'John',
      });

      it('throws an error with statusCode 400', async () => {
        const handler = {
          context: {} as Context,
          error: {} as Error,
          event: { body },
          internal: jest.fn(),
          response: {},
        };
        await expect(
          classValidatorMiddleware({
            classType: NameBody,
          }).before(handler),
        ).rejects.toMatchObject({
          statusCode: 400,
        });
      });
    });
  });

  describe('before hook with query params', () => {
    describe('with valid input', () => {
      const queryStringParameters = JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
      });

      it('sets the queryStringParameters to the transformed and validated value', async () => {
        const handler = {
          context: {} as Context,
          error: {} as Error,
          event: { queryStringParameters },
          internal: jest.fn(),
          response: {},
        };
        await classValidatorMiddleware({
          classType: NameBody,
          validateQueryParamas: true,
        }).before(handler);
        expect(handler.event.queryStringParameters).toEqual({
          firstName: 'John',
          lastName: 'Doe',
        });
      });
    });

    describe('with invalid input', () => {
      const body = JSON.stringify({
        firstName: 'John',
      });

      it('throws an error with statusCode 400', async () => {
        const handler = {
          context: {} as Context,
          error: {} as Error,
          event: { body },
          internal: jest.fn(),
          response: {},
        };
        await expect(
          classValidatorMiddleware({
            classType: NameBody,
          }).before(handler),
        ).rejects.toMatchObject({
          statusCode: 400,
        });
      });
    });
  });
});
