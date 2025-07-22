import { Controller, Post, Body, Req, UseGuards, Get, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { QuestionDto } from '@modules/chat/dto/question.dto';
import { Request } from 'express';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Public } from '../../decorators/auth.decorators';
import { RequestWithUser } from '@modules/shared/types/request.type';

@Controller('chat')
@UseGuards(JwtAccessTokenGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('question')
  @Public()
  question(
    @Body() body: QuestionDto,
    @Req() req: Request,
    @Req() reqUser: RequestWithUser,
  ) {
    return this.chatService.question(body, req, reqUser);
  }

  @Get('history')
  async getChatHistory(@Req() req: RequestWithUser) {
    // req.user is the logged-in user
    if (!req.user._id) {
      throw new NotFoundException();
    }
    return this.chatService.getChatHistoryByUser(req.user._id);
  }
}
