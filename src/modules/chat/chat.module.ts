import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '@modules/chat/entities/chat.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    { provide: 'ChatRepositoryInterface', useClass: ChatRepository },
  ],
})
export class ChatModule {}
