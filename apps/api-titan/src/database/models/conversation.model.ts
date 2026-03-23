import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Default,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ConversationType, IConversation } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { ConversationParticipant } from './conversation-participant.model';
import { Message } from './message.model';

export type CreationModelConversation = WithRequired<
  Partial<IConversation>,
  'type'
>;

@Table({ tableName: 'conversation', paranoid: false, timestamps: true })
export class Conversation extends CustomModel<
  IConversation,
  CreationModelConversation
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  name: string | null;

  @AllowNull(false)
  @Default(ConversationType.DIRECT)
  @Column({ type: DataType.ENUM(...Object.values(ConversationType)) })
  type: ConversationType;

  @HasMany(() => ConversationParticipant)
  participants: ConversationParticipant[];

  @HasMany(() => Message)
  messages: Message[];
}
