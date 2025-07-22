import { FindAllResponse } from '@modules/shared/types/common.type';

export interface BaseInterfaceRepository<T> {
  create(dto: Partial<T>): Promise<T>;

  findOneById(id: string, projection?: string): Promise<T | null>;

  findOneByCondition(
    condition?: object,
    projection?: string,
  ): Promise<T | null>;

  findAll(condition: object, options?: object): Promise<FindAllResponse<T>>;

  update(id: string, dto: Partial<T>): Promise<T | null>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
