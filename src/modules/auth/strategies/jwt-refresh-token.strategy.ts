import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '@modules/auth/auth.service';
import { ExtractJwt } from 'passport-jwt';
import { TokenPayload } from '@modules/auth/interfaces/token.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token'
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'refresh_token_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const token = req.headers?.authorization?.split('Bearer ')[1];
    if (!token) {
      throw new BadRequestException();
    }

    return await this.authService.getUserIfRefreshTokenMatched(
      payload.user_id,
      token,
    );
  }
}