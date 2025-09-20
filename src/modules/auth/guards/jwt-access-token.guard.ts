import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../decorators/auth.decorators';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const routerName = context.getHandler().name;
    const isQuestionRoute = routerName.includes('question');

    if (isPublic || isQuestionRoute) {
      return user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
