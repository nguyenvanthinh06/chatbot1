import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Config {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET') || 'secret';
  }

  get envMode(): string {
    return this.configService.get('NODE_ENV') || 'development';
  }
}