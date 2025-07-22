import {
  BadRequestException,
  ConflictException,
  Injectable, UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@modules/auth/interfaces/token.interface';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const existed_user = await this.usersService.findOneByCondition(email);
    if (existed_user) {
      throw new ConflictException('Email already existed!!');
    }
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
    const user = await this.usersService.create({
      ...signUpDto,
      username: `${email.split('@')[0]}${Math.floor(
        10 + Math.random() * (999 - 10),
      )}`, // Random username
      password: hashedPassword,
    });
    return user;
  }

  async signIn(user_id: string) {
    const access_token = this.generateAccessToken({
      user_id,
    });
    const refresh_token = this.generateRefreshToken({
      user_id,
    });
    await this.storeRefreshToken(user_id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!');
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const isMatching = await bcrypt.compare(plainText, hashedText);
    if (!isMatching) {
      throw new BadRequestException();
    }
  }

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: `access_token_secret`,
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: `refresh_token_secret`,
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
    await this.usersService.setCurrentRefreshToken(user_id, hashed_token);
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.verifyPlainContentWithHashedContent(
      refreshToken,
      user.current_refresh_token
    );
    return user;

  }
}
