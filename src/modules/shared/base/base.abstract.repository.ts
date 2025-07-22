import { BaseEntity } from '@modules/shared/base/base.entity';
import { BaseInterfaceRepository } from '@modules/shared/base/base.interface.repository';
import { Model } from 'mongoose';
import { FindAllResponse } from '@modules/shared/types/common.type';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseInterfaceRepository<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: Partial<T>): Promise<T> {
    const createData = await this.model.create(dto);
    return createData.toObject();
  }

  async findOneById(id: string, projection?: string): Promise<T | null> {
    const item = await this.model.findById(id, projection);
    return item ? item.toObject() : null;
  }

  async findOneByCondition(
    condition: object = {},
    projection?: string,
  ): Promise<T | null> {
    const item = await this.model
      .findOne(
        {
          ...condition,
          delete_at: null,
        },
        projection,
      )
      .exec();
    return item ? item.toObject() : null;
  }

  async findAll(
    condition: object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...condition, delete_at: null }),
      this.model.find(
        { ...condition, delete_at: null },
        options?.['projection'],
        options,
      ),
    ]);
    return {
      count,
      items: items.map((item) => item.toObject()),
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T | null> {
    const result = await this.model.findOneAndUpdate(
      { _id: id, delete_at: null },
      dto,
      { new: true },
    );
    return result ? result.toObject() : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { delete_at: new Date() })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
