import { UserCardPossession } from './user-card-possession';
import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Overwrite } from 'abyss_core';
import { CustomModel } from '../custom/custom-model';
import { Tag } from './tag';
import { ICardTag } from '../../../../local-core/types';

export type ModelCardTag = Overwrite<
  ICardTag,
  {
    //
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({ stats: {} }))
@Table({ tableName: 'cardTags', paranoid: false, timestamps: false })
export class CardTag extends CustomModel<ModelCardTag> implements ModelCardTag {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Tag)
  @PrimaryKey
  @Column
  tagId: string;

  @ForeignKey(() => UserCardPossession)
  @PrimaryKey
  @Column
  cardPossessionId: string;
}
