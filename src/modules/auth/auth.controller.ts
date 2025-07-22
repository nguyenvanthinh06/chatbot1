import {
  BadRequestException,
  Body,
  Controller, InternalServerErrorException,
  Post,
  Req,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { LocalAuthGuard } from '@modules/auth/guards/local.guard';
import { RequestWithUser } from '@modules/shared/types/request.type';
import { JwtRefreshTokenGuard } from '@modules/auth/guards/jwt-refresh-token.guard';
import { ResponseInterceptor } from '../../interceptors/response/response.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: RequestWithUser) {
    const { user } = req;
    if (!user._id) {
      throw new BadRequestException('User not found');
    }
    return await this.authService.signIn(user._id.toString());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;
    if (!user?._id) {
      throw new InternalServerErrorException();
    }
    const access_token = this.authService.generateAccessToken({
      user_id: user._id.toString(),
    });
    return {
      access_token,
    };
  }
}
