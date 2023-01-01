import { Model } from 'sequelize-typescript';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { IncludeOptionsWithModel, CustomModel } from '../../../database/custom/custom-model.model';
import { LoggerModel } from './logger.abstract';

type _ParamsFetch<T, TypeParams> = {
  model: T | WhereOptions<TypeParams>;
};

export class Service {
  protected readonly logger = new LoggerModel(this.constructor.name);
}

export class EntityService<Entity extends Model<any, any>, ModelEntity> extends Service {
  protected async _fetch(
    modelParams: any,
    params: _ParamsFetch<Entity, ModelEntity>,
    include?: IncludeOptionsWithModel | IncludeOptionsWithModel[],
    options?: FindOptions,
  ): Promise<Entity> {
    let model: unknown;

    if (!(params.model instanceof modelParams)) {
      model = await modelParams.findOne({
        where: {
          ...(params.model as WhereOptions<Entity>),
        },
        ...options,
        include: include,
      });
    } else {
      model = params.model;
      if (include) {
        await (
          model as unknown as CustomModel<Record<string, any>, Record<string, any>>
        ).fetchMultipleAssociation(include);
      }
    }

    if (!model) {
      throw new Error(`${modelParams.name} not found and should exist`);
    }

    return model as Entity;
  }
}
