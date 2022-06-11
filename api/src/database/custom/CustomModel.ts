import { AssociationGetOptions, Model } from 'sequelize-typescript';
import { Includeable, IncludeOptions } from 'sequelize/types';
import { isArray } from 'underscore';
import AbyssCore from 'abyss_core';

export type IncludeOptionsCustom = IncludeOptions & {
  include?: IncludeOptionsCustom[];
  scope?: string[];
};

type GetteTestOptions = {
  force?: boolean;
  autoComplete?: boolean;
};

export class CustomModel extends Model {
  async getterAssociations(associations: (keyof this)[], force?: boolean): Promise<this> {
    let allDefined = true;
    for (const association of associations)
      if (!this[association]) {
        allDefined = false;
        break;
      }

    if (allDefined && !force) return this;

    await AbyssCore.promiseForEach(
      associations,
      async (association: keyof this) => (this[association] = await this.$get(association)),
    );
    return this;
  }

  async getterAssociation(
    association: keyof this,
    options?: AssociationGetOptions,
    force?: boolean,
  ): Promise<this> {
    if (this[association] && !force) return this;
    this[association] = await this.$get(association, options);
    return this;
  }

  async fetchMultipleAssociation(
    params: IncludeOptionsCustom[],
    options?: GetteTestOptions,
  ): Promise<this> {
    await AbyssCore.promiseForEach(
      params,
      async (param: IncludeOptionsCustom) => await this.fetchAssociation(param, options),
    );
    return this;
  }

  async fetchAssociation(params: IncludeOptionsCustom, options?: GetteTestOptions): Promise<this> {
    const { include, model, as } = params;
    const modelName = as ?? AbyssCore.lowerFirstLetter(model.name);

    if (await this.checkAssociation(params, options?.autoComplete)) return this;

    this[modelName] = await this.$get(modelName as keyof this, {
      include: [
        ...include,
        ...((this as any)._options?.include?.find((inc: IncludeOptions) => {
          return inc.model.name.toLowerCase() === modelName;
        })?.include ?? []),
      ],
    });

    return this;
  }

  async checkAssociation(params: IncludeOptionsCustom, autoComplete?: boolean): Promise<boolean> {
    const { include, model, as } = params;

    const modelName = as ?? AbyssCore.lowerFirstLetter(model.name);

    if (!this[modelName]) {
      if (autoComplete) {
        this[modelName] = await this.$get(modelName as keyof this, { include });
        return true;
      }
      return false;
    }
    if (!include) return true;

    const includeWithScope = include;

    return this.checkSubAssociations(includeWithScope, autoComplete);
  }

  async checkSubAssociations(
    params: Includeable[] & IncludeOptionsCustom[],
    autoComplete?: boolean,
  ): Promise<boolean> {
    return (
      await AbyssCore.promiseForEach<IncludeOptions, boolean>(
        params,
        async (elem: Includeable & IncludeOptionsCustom) => {
          const modelName = elem.as ?? AbyssCore.lowerFirstLetter(elem.model.name);

          if (!this[modelName]) return false;
          if (!elem.include) return true;

          if (isArray(this[modelName])) {
            return (
              await AbyssCore.promiseForEach<CustomModel, boolean>(
                this[modelName],
                async (model: CustomModel) => model.checkAssociation(elem, autoComplete),
              )
            ).every((elem) => elem);
          }

          return (this[modelName] as CustomModel).checkAssociation(elem, autoComplete);
        },
      )
    ).every((res) => res);
  }
}
