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
import { IMatchLineup } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Match } from './match.model';
import { ClubMember } from './club-member.model';

export type CreationModelMatchLineup = WithRequired<
  Partial<IMatchLineup>,
  'matchId' | 'clubMemberId'
>;

@Table({ tableName: 'titan_match_lineup', paranoid: false, timestamps: true })
export class MatchLineup extends CustomModel<
  IMatchLineup,
  CreationModelMatchLineup
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

  @AllowNull(false)
  @ForeignKey(() => ClubMember)
  @Column({ type: DataType.UUID })
  clubMemberId: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isStarter: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  minutesPlayed: number | null;

  @BelongsTo(() => Match)
  match: Match;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
