import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/users/interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseAbstractService } from '@modules/shared/base/base.abstract.service';
import { User } from '@modules/users/entities/user.entity';
import { FindAllResponse } from '@modules/shared/types/common.type';

@Injectable()
export class UsersService extends BaseAbstractService<User> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {
    super(usersRepository);
  }
  async create(createUserDto: CreateUserDto) {
    // let user_role = await this.user_roles_service.findOneByCondition({
    //   name: USER_ROLE.USER,
    // });
    // if (!user_role) {
    //   user_role = await this.user_roles_service.create({
    //     name: USER_ROLE.USER,
    //   });
    // }
    const user = await this.usersRepository.create(createUserDto);
    return user;
  }

  async findOneByCondition(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneByCondition({ email });
    return user || null;
  }

  async findAll(
    filter?: object,
    options?: object,
  ): Promise<FindAllResponse<User>> {
    const filterArg = filter || {};
    return await this.usersRepository.findAllWithSubFields(filterArg, {
      ...options,
      populate: 'role',
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByCondition({ email });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async setCurrentRefreshToken(id: string, hashedToken: string): Promise<void> {
    await this.usersRepository.update(id, {
      current_refresh_token: hashedToken,
    });
  }
}
