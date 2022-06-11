import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';
import AbyssCore from 'abyss_core';
import { handleError } from '../../utils/error.utils';
import { Code, ErrorType } from 'abyss_crypt_core';

type Options<T> = FindOptions<T> & { page?: number; limit?: number };

export default class Paginator<T extends Model> {
  private model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async paginate(options: Options<T>, scopes: string[] = []): Promise<AbyssCore.BasePaginate<T>> {
    try {
      const _options: FindOptions<T['_attributes']> = Object.keys(options).reduce((acc, key) => {
        if (!['limit', 'page'].includes(key)) {
          acc[key] = options[key];
        }
        return acc;
      }, {});

      const countOptions = Object.keys(options).reduce((acc, key) => {
        if (['include'].includes(key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc.distinct = true;
        }
        if (!['order', 'attributes'].includes(key)) {
          acc[key] = options[key];
        }
        return acc;
      }, {});

      _options.limit = options.limit;
      _options.offset = options.limit * ((options.page ?? 1) - 1) || 0;
      _options.order = options.order ?? [['createdAt', 'DESC']];

      const dataPromise = this.model.scope(scopes).findAll(_options);
      const totalItemsPromise = this.model.count(countOptions);
      const [rows, totalItems] = await Promise.all([dataPromise, totalItemsPromise]);
      const maxPages = Math.ceil(totalItems / options.limit);

      return {
        maxPages,
        currentPage: options.page,
        data: rows,
        totalItems,
      };
    } catch (error) {
      throw handleError({
        code: Code.internalServerError,
        type: ErrorType.apiError,
        message: error,
      });
    }
  }
}
