import { CardTag } from './card-tag';
import { UserCardPossession } from './user-card-possession';
import { ITag as ITag } from '../../../../local-core/types/models/tag.dto';
import { User } from './user';
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Overwrite } from 'abyss_core';
import { TagTypeEnum } from '../../../../local-core/enums';

export type ModelTag = Overwrite<
  ITag,
  {
    user: User;
    cardPossession: UserCardPossession[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'tag', paranoid: false, timestamps: false })
export class Tag extends CustomModel<ModelTag> implements ModelTag {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  type: TagTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => UserCardPossession, { through: () => CardTag, onDelete: 'CASCADE' })
  cardPossession: UserCardPossession[];
}
