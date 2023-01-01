import { Model, ModelType } from 'sequelize-typescript';
import { IncludeOptions } from 'sequelize/types';
import { isArray } from 'underscore';
import { lowerFirst } from 'lodash';

export type IncludeOptionsWithModel = IncludeOptions & {
  include?: IncludeOptionsWithModel[];
  model: ModelType<any, any>;
};

export class CustomModel<
  ModelAttributes extends Record<string, any>,
  CreationModelAttributes extends Partial<ModelAttributes>,
> extends Model<ModelAttributes, CreationModelAttributes> {
  async fetchMultipleAssociation(
    includeOptions: IncludeOptionsWithModel | IncludeOptionsWithModel[],
  ): Promise<this> {
    if (isArray(includeOptions)) {
      await Promise.all(
        includeOptions.map(async (includeOption) => {
          await this.fetchAssociation(includeOption);
        }),
      );
    } else {
      await this.fetchAssociation(includeOptions);
    }

    return this;
  }

  private async fetchAssociation(params: IncludeOptionsWithModel): Promise<this> {
    await this.completeAssociation(params);
    return this;
  }

  public async completeAssociation(params: IncludeOptionsWithModel): Promise<void> {
    const { include, model, as } = params;

    const modelName = (as ?? lowerFirst(model.name)) as keyof CustomModel<
      ModelAttributes,
      CreationModelAttributes
    >;

    // Note(Mehdi): Fetching first level missing association
    if (!this[modelName]) {
      this[modelName] = await this.$get(modelName, { include });
    }

    if (!include) {
      return;
    }

    // Note(Mehdi): Fetching sub level missing association
    await Promise.all(
      (include as IncludeOptionsWithModel[]).map(async (includeElement) => {
        const modelName = (as ?? lowerFirst(model.name)) as keyof CustomModel<
          ModelAttributes,
          CreationModelAttributes
        >;

        await Promise.all(
          this[modelName].map(async (modelAssociation: CustomModel<any, any>) => {
            await modelAssociation.completeAssociation(includeElement);
          }),
        );
      }),
    );
  }
}
