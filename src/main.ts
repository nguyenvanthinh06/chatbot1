import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // Enable CORS for all origins
  app.enableCors({
    origin: '*', // Allows requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent with cross-origin requests
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed request headers
  });
  app.listen(process.env.PORT ?? 3000);
}
bootstrap();
