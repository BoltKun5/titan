import { CardTag } from './card-tag';
import {
  CardPossessionDeletionTypeEnum,
  CardVariationConditionEnum,
  CardVariationGradeCompanyEnum,
} from '../../../../local-core/enums/card-variation.enum';
import { Card } from './card';
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { User } from './user';
import { IUserCardPossession } from '../../../../local-core/types';
import { Overwrite } from 'abyss_core';
import { CardAdditionalPrinting } from './card-additional-printing';
import { Tag } from './tag';

export type ModelUserCardPossession = Overwrite<
  IUserCardPossession,
  {
    user: User;
    card: Card;
    tags?: Tag[];
    printing: CardAdditionalPrinting | null;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'userCardPossession', paranoid: false, timestamps: true })
export class UserCardPossession
  extends CustomModel<ModelUserCardPossession>
  implements ModelUserCardPossession
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardId: string;

  @BelongsTo(() => Card)
  card: Card;

  @Column({
    type: DataType.INTEGER,
  })
  condition: CardVariationConditionEnum;

  @Column({
    type: DataType.INTEGER,
  })
  grade: CardVariationGradeCompanyEnum;

  @ForeignKey(() => CardAdditionalPrinting)
  @Column({
    type: DataType.STRING,
  })
  printingId: string | null;

  @BelongsTo(() => CardAdditionalPrinting)
  printing: CardAdditionalPrinting | null;

  @BelongsToMany(() => Tag, { through: () => CardTag, onDelete: 'CASCADE' })
  tags: Tag[];

  @Column({
    type: DataType.STRING,
  })
  note: string;

  @Column({
    type: DataType.STRING,
  })
  boosterId: string;

  @Column({
    type: DataType.INTEGER,
  })
  deletionType: CardPossessionDeletionTypeEnum | null;
}
