import { CardTag } from './card-tag.model';
import { Card } from './card.model';
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
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { User } from './user.model';
import { CardAdditionalPrinting } from './card-additional-printing.model';
import { Tag } from './tag.model';
import { WithRequired } from '../../core';
import {
  Overwrite,
  IUserCardPossession,
  CardPossessionConditionEnum,
  CardPossessionGradeCompanyEnum,
  CardPossessionDeletionTypeEnum,
  CardPossessionLanguageEnum,
} from 'vokit_core';

export type ModelUserCardPossession = Overwrite<
  IUserCardPossession,
  {
    user: User;
    card: Card;
    tags?: Tag[];
    printing: CardAdditionalPrinting | null;
  }
>;

export type CreationModelUserCardPossession = WithRequired<
  Partial<IUserCardPossession>,
  'userId' | 'cardId' | 'condition' | 'grade' | 'printingId' | 'note' | 'boosterId' | 'deletionType'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'userCardPossession', paranoid: true, timestamps: true })
export class UserCardPossession
  extends CustomModel<IUserCardPossession, CreationModelUserCardPossession>
  implements ModelUserCardPossession
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Index
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Index
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
  condition: CardPossessionConditionEnum;

  @Column({
    type: DataType.INTEGER,
  })
  grade: CardPossessionGradeCompanyEnum;

  @Index
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
    type: DataType.INTEGER,
  })
  language: CardPossessionLanguageEnum | null;

  @Column({
    type: DataType.STRING,
  })
  boosterId: string;

  @Column({
    type: DataType.INTEGER,
  })
  deletionType: CardPossessionDeletionTypeEnum | null;
}
