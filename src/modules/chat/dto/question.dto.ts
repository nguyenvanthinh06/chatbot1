import { IsNotEmpty } from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  question: string;
}