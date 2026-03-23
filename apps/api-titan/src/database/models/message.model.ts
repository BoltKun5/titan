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
import { IMessage, MessageType } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { Conversation } from './conversation.model';
import { User } from './user.model';

export type CreationModelMessage = WithRequired<
  Partial<IMessage>,
  'conversationId' | 'senderId' | 'content'
>;

@Table({ tableName: 'message', paranoid: false, timestamps: true })
export class Message extends CustomModel<IMessage, CreationModelMessage> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Conversation)
  @Column({ type: DataType.UUID })
  conversationId: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  senderId: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  content: string;

  @AllowNull(false)
  @Default(MessageType.TEXT)
  @Column({ type: DataType.ENUM(...Object.values(MessageType)) })
  type: MessageType;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @BelongsTo(() => User)
  sender: User;
}
