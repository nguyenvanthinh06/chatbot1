import { FindAllResponse } from '@modules/shared/types/common.type';

export interface Write<T> {
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(filter?: object, options?: object): Promise<FindAllResponse<T>>;
  findOne(id: string): Promise<T | null>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
