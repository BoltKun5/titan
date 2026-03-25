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
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IMessage, MessageType, MessageStatus } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { Conversation } from './conversation.model';
import { User } from './user.model';
import { MessageReaction } from './message-reaction.model';

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

  @AllowNull(false)
  @Default(MessageStatus.SENT)
  @Column({ type: DataType.ENUM(...Object.values(MessageStatus)) })
  status: MessageStatus;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isEdited: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isDeleted: boolean;

  @AllowNull(true)
  @ForeignKey(() => Message)
  @Column({ type: DataType.UUID })
  replyToId: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  fileUrl: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  fileName: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  fileSize: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATE })
  expiresAt: string | null;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @BelongsTo(() => User)
  sender: User;

  @BelongsTo(() => Message, 'replyToId')
  replyTo: Message;

  @HasMany(() => MessageReaction)
  reactions: MessageReaction[];
}
