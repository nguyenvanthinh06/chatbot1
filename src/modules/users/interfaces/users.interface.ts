import { BaseInterfaceRepository } from '@modules/shared/base/base.interface.repository';
import { User } from '@modules/users/entities/user.entity';
import { FindAllResponse } from '@modules/shared/types/common.type';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
  findAllWithSubFields(
    condition: object,
    options: {
      projection?: string;
      populate?: string[] | any;
      offset?: number;
      limit?: number;
    },
  ): Promise<FindAllResponse<User>>;
}

export interface UserStoreRefreshToken {
  current_refresh_token: string;
}