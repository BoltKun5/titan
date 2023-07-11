import { UserCardPossession } from './user-card-possession.model';
import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  ForeignKey,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Tag } from './tag.model';
import { WithRequired } from '../../core';
import { Overwrite, ICardTag } from 'vokit_core';

export type ModelCardTag = Overwrite<
  ICardTag,
  {
    //
  }
>;

export type CreationModelAdminConfig = WithRequired<
  Partial<ICardTag>,
  'tagId' | 'cardPossessionId'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardTags', paranoid: false, timestamps: false })
export class CardTag
  extends CustomModel<ICardTag, CreationModelAdminConfig>
  implements ModelCardTag
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Index
  @ForeignKey(() => Tag)
  @PrimaryKey
  @Column
  tagId: string;

  @Index
  @ForeignKey(() => UserCardPossession)
  @PrimaryKey
  @Column
  cardPossessionId: string;
}
