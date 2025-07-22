import { BaseEntity } from '@modules/shared/base/base.entity';
import { BaseServiceInterface } from '@modules/shared/base/base.interface.service';
import { FindAllResponse } from '@modules/shared/types/common.type';
import { BaseInterfaceRepository } from '@modules/shared/base/base.interface.repository';

export abstract class BaseAbstractService<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseInterfaceRepository<T>) {}

  async create(create_dto: T): Promise<T> {
    return await this.repository.create(create_dto);
  }

  async findAll(filter: object, options?: object): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options);
  }
  async findOne(id: string): Promise<T | null> {
    return await this.repository.findOneById(id);
  }

  async update(id: string, update_dto: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, update_dto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.repository.softDelete(id);
  }
}
