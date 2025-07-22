import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@modules/shared/base/base.abstract.repository';
import { Chat, ChatDocument } from '@modules/chat/entities/chat.entity';
import { ChatRepositoryInterface } from '@modules/chat/interfaces/chat.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatRepository extends BaseRepositoryAbstract<ChatDocument> implements ChatRepositoryInterface {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>
  ) {
    super(chatModel);
  }
}
