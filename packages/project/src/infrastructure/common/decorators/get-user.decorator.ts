import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface IAuthUser {
  id: string;
}

/**
 * Get the authenticated user from the request
 * @param data
 * @param context
 * @returns IAuthUser  The authenticated user from the request context
 */
export const GetAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IAuthUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
