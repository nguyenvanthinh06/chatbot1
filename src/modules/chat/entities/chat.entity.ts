import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@modules/shared/base/base.entity';
import * as mongoose from 'mongoose';
import { User } from '@modules/users/entities/user.entity';

export type ChatDocument = mongoose.HydratedDocument<Chat>;

@Schema({
  collection: 'chat',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Chat extends BaseEntity {
  @Prop({ required: true, unique: true })
  session_id: string;

  @Prop([
    {
      role: { type: String, required: true }, // 'user' || 'model'
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ])
  messages: { role: string; content: string }[];

  @Prop({ default: Date.now })
  last_activity: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
