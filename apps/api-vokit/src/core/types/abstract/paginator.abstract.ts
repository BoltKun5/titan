import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import { BasePaginate, ErrorType, HttpErrorCode } from 'vokit_core';
import { handleError } from '../../../utils/error.utils';

type Options<T> = FindOptions<T> & { page?: number; limit?: number };

export class Paginator<T extends Model> {
  private model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async paginate(options: Options<T>, scopes: string[] = []): Promise<BasePaginate<T>> {
    const page = options.page || 1;
    const limit = options.limit || 1;

    try {
      const _options = Object.keys(options).reduce((acc, key) => {
        if (['limit', 'page'].includes(key)) {
          return acc;
        }
        const localKey = key as keyof Omit<Options<T>, 'page' | 'limit'>;

        acc[localKey] = options[localKey];
        return acc;
      }, {} as Record<string, unknown>);

      const countOptions = Object.keys(options).reduce((acc, key) => {
        if (['order', 'attributes'].includes(key)) {
          return acc;
        }
        const localKey = key as keyof Omit<Options<T>, 'order' | 'attributes'>;

        if (['include'].includes(localKey)) {
          acc.distinct = true;
        }

        acc[localKey] = options[localKey];
        return acc;
      }, {} as Record<string, unknown>);

      const optionsWithLimit: Options<T> = {
        ..._options,
        limit,
        offset: limit * (page - 1) || 0,
        order: options.order ?? [['createdAt', 'DESC']],
      };

      const [rows, totalItems] = await Promise.all([
        this.model.scope(scopes).findAll(optionsWithLimit),
        this.model.count(countOptions),
      ]);
      const maxPages = Math.ceil(totalItems / limit);

      return {
        maxPages,
        currentPage: page,
        data: rows,
        totalItems,
      };
    } catch (error: any) {
      throw handleError({
        code: HttpErrorCode.internalServerError,
        type: ErrorType.apiError,
        message: error,
      });
    }
  }
}
