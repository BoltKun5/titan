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
import { IConversationParticipant, ParticipantRole } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';
import { Conversation } from './conversation.model';
import { User } from './user.model';

export type CreationModelConversationParticipant = WithRequired<
  Partial<IConversationParticipant>,
  'conversationId' | 'userId'
>;

@Table({
  tableName: 'conversation_participant',
  paranoid: false,
  timestamps: false,
})
export class ConversationParticipant extends CustomModel<
  IConversationParticipant,
  CreationModelConversationParticipant
> {
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
  userId: string;

  @AllowNull(false)
  @Default(ParticipantRole.MEMBER)
  @Column({ type: DataType.ENUM(...Object.values(ParticipantRole)) })
  role: ParticipantRole;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isPinned: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isArchived: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isMuted: boolean;

  @Default(() => new Date())
  @Column({ type: DataType.DATE })
  joinedAt: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  lastReadAt: string | null;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @BelongsTo(() => User)
  user: User;
}
