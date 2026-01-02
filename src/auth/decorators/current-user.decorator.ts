import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para obter o usuário atual da requisição
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

