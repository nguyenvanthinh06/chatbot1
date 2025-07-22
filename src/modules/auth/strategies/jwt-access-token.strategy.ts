import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '@modules/users/users.service';
import { TokenPayload } from '@modules/auth/interfaces/token.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(JwtStrategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access_token_secret',
    });
  }

  async validate(payload: TokenPayload) {
    console.log('User id: ', payload.user_id);
    return await this.usersService.findOne(payload.user_id);
  }
}
