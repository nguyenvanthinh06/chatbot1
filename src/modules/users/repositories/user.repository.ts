import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@modules/shared/base/base.abstract.repository';
import { User, UserDocument } from '@modules/users/entities/user.entity';
import { UserRepositoryInterface } from '@modules/users/interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { FindAllResponse } from '@modules/shared/types/common.type';

@Injectable()
export class UserRepository
  extends BaseRepositoryAbstract<User>
  implements UserRepositoryInterface
{
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  async findAllWithSubFields(
    condition: FilterQuery<UserDocument>,
    options: {
      projection?: string;
      populate?: string[] | PopulateOptions | PopulateOptions[] | 'role';
      offset?: number;
      limit?: number;
    },
  ): Promise<FindAllResponse<UserDocument>> {
    const [count, items] = await Promise.all([
      this.userModel.countDocuments({ ...condition, deleted_at: null }),
      this.userModel.find(
        { ...condition, deleted_at: null },
        options?.projection || '',
        {
          skip: options.offset || 0,
          limit: options.limit || 10,
        },
      ),
      // .populate(options.populate),
    ]);
    return {
      count,
      items,
    };
  }
}
