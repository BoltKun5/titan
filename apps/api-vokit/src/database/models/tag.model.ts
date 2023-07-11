import { CardTag } from './card-tag.model';
import { UserCardPossession } from './user-card-possession.model';
import { User } from './user.model';
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
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { WithRequired } from '../../core';
import { ITag, Overwrite, TagTypeEnum } from 'vokit_core';

export type ModelTag = Overwrite<
  ITag,
  {
    user: User;
    cardPossession: UserCardPossession[];
  }
>;

export type CreationModelTag = WithRequired<Partial<ITag>, 'type' | 'name' | 'userId'>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'tag', paranoid: false, timestamps: false })
export class Tag extends CustomModel<ITag, CreationModelTag> implements ModelTag {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  type: TagTypeEnum;

  @Index
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Index
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
