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
import { IMatchEvent, MatchEventType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Match } from './match.model';
import { ClubMember } from './club-member.model';

export type CreationModelMatchEvent = WithRequired<
  Partial<IMatchEvent>,
  'matchId' | 'eventType'
>;

@Table({ tableName: 'titan_match_event', paranoid: false, timestamps: true })
export class MatchEvent extends CustomModel<
  IMatchEvent,
  CreationModelMatchEvent
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Match)
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(true)
  @ForeignKey(() => ClubMember)
  @Default(null)
  @Column({ type: DataType.UUID })
  clubMemberId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchEventType)) })
  eventType: MatchEventType;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  subtype: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  minute: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  period: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSON })
  details: Record<string, any> | null;

  @BelongsTo(() => Match)
  match: Match;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
