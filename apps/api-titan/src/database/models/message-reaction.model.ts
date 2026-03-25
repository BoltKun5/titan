import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IMessageReaction } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { Message } from './message.model';
import { User } from './user.model';

export type CreationModelMessageReaction = WithRequired<
  Partial<IMessageReaction>,
  'messageId' | 'userId' | 'emoji'
>;

@Table({
  tableName: 'message_reaction',
  paranoid: false,
  timestamps: true,
  updatedAt: false,
})
export class MessageReaction extends CustomModel<
  IMessageReaction,
  CreationModelMessageReaction
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Message)
  @Column({ type: DataType.UUID })
  messageId: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(8) })
  emoji: string;

  @BelongsTo(() => Message)
  message: Message;

  @BelongsTo(() => User)
  user: User;
}
