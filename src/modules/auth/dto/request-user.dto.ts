import { User } from '@modules/users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class RequestWithUser {
  @IsNotEmpty()
  user: User;
}
