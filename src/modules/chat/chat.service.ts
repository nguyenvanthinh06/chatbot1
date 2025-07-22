import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuestionDto } from '@modules/chat/dto/question.dto';
import { Request } from 'express';
import { GoogleGenAI } from '@google/genai';
import * as path from 'path';
import * as fs from 'fs/promises';
import { MessageItem } from '@modules/chat/interfaces/message.interface';
import { ChatRepositoryInterface } from '@modules/chat/interfaces/chat.interface';
import { BaseAbstractService } from '@modules/shared/base/base.abstract.service';
import { Chat } from '@modules/chat/entities/chat.entity';
import { RequestWithUser } from '@modules/shared/types/request.type';

@Injectable()
export class ChatService extends BaseAbstractService<Chat> {
  private ai: GoogleGenAI;

  constructor(
    @Inject('ChatRepositoryInterface')
    private readonly chatRepository: ChatRepositoryInterface,
  ) {
    super(chatRepository);
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async question(body: QuestionDto, req: Request, reqUser: RequestWithUser) {
    const { question } = body;
    try {
      const filePath = path.join(process.cwd(), 'src', 'AIModels', 'guide.txt');
      const contentGuide = await fs.readFile(filePath, 'utf-8');

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: contentGuide,
        },
        contents: question,
      });
      if (!response?.text) {
        throw new InternalServerErrorException();
      }
      const timestamp = new Date().toISOString();
      const askNew: MessageItem[] = [
        { role: 'user', content: question, timestamp },
        { role: 'model', content: response.text, timestamp },
      ];
      await this.handleSaveAsk(req, reqUser, askNew);
      return {
        question,
        answer: response.text,
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getChatHistoryByUser(userId: string) {
    // Find all chat sessions for the user, ordered by last_activity descending
    const result = await this.chatRepository.findAll(
      { user: userId },
      {
        sort: { last_activity: -1 },
        projection: { session_id: 0, delete_at: 0, user: 0, last_activity: 0 },
      },
    );
    return result;
  }

  private async handleSaveAsk(
    req: Request,
    reqUser: RequestWithUser,
    message: MessageItem[],
  ) {
    try {
      const token = req.headers?.authorization?.split('Bearer ')[1];
      if (!token || !req.user) {
        return;
      }
      const userChatted = await this.chatRepository.findOneByCondition({
        session_id: token,
      });
      if (!userChatted?._id) {
        await this.chatRepository.create({
          session_id: token,
          messages: message,
          last_activity: new Date(),
          user: reqUser.user,
        });
        return;
      }
      await this.chatRepository.update(userChatted._id, {
        last_activity: new Date(),
        messages: [...userChatted.messages, ...message],
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
