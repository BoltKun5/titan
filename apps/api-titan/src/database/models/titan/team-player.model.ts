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
import { ITeamPlayer } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Team } from './team.model';
import { ClubMember } from './club-member.model';

export type CreationModelTeamPlayer = WithRequired<
  Partial<ITeamPlayer>,
  'teamId' | 'clubMemberId'
>;

@Table({ tableName: 'titan_team_player', paranoid: false, timestamps: true })
export class TeamPlayer extends CustomModel<
  
 

  ITeamPlayer,
  CreationModelTeamPlayer
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Team)
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false)
  @ForeignKey(() => ClubMember)
  @Column({ type: DataType.UUID })
  clubMemberId: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCaptain: boolean;

  @BelongsTo(() => Team)
  team: Team;

  @BelongsTo(() => ClubMember)
  clubMember: ClubMember;
}
