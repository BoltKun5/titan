import { Code, ErrorType } from 'abyss_crypt_core';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { CustomModel, IncludeOptionsCustom } from '../../database/custom/CustomModel';
import { handleError } from '../../utils/error.utils';

export type _ParamsFetch<T> = {
  model: T | WhereOptions<T> | any;
};

export class DefaultService {
  public static async _fetch<T>(
    modelParams: typeof CustomModel,
    params: _ParamsFetch<T>,
    include?: IncludeOptionsCustom[],
    options?: FindOptions,
  ): Promise<T> {
    let model: any,
      shouldFetch = true;

    if (!(params.model instanceof modelParams)) {
      shouldFetch = false;
      model = await modelParams.findOne({
        where: {
          ...params.model,
        },
        ...options,
        include: include,
      });
    } else {
      model = params.model as any;
    }

    if (include && shouldFetch)
      await (model as unknown as CustomModel).fetchMultipleAssociation(include, {
        autoComplete: true,
      });

    if (!model)
      throw handleError({
        code: Code.notFound,
        type: ErrorType.resourceError,
        message: `${modelParams.name} not found`,
      });

    return model;
  }
}
