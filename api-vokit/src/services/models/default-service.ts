import { Code, ErrorType } from 'abyss_crypt_core';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { handleError } from '../../utils/error.utils';
import { CustomModel, IncludeOptionsWithModel } from '../../database/custom/custom-model';

type _ParamsFetch<T, TypeParams> = {
  model: T | WhereOptions<TypeParams>;
};

export class DefaultService {
  protected static async _fetch<T, TypeParams>(
    modelParams: any,
    params: _ParamsFetch<T, TypeParams>,
    include?: IncludeOptionsWithModel | IncludeOptionsWithModel[],
    options?: FindOptions,
  ): Promise<T> {
    let model: unknown;

    if (!(params.model instanceof modelParams)) {
      model = await modelParams.findOne({
        where: {
          ...(params.model as WhereOptions<T>),
        },
        ...options,
        include: include,
      });
    } else {
      model = params.model;
      if (include) {
        await (model as unknown as CustomModel<Record<string, any>>).fetchMultipleAssociation(
          include,
        );
      }
    }

    if (!model) {
      throw handleError({
        code: Code.notFound,
        type: ErrorType.resourceError,
        message: `${modelParams.name} not found and should exist`,
      });
    }

    return model as T;
  }
}
