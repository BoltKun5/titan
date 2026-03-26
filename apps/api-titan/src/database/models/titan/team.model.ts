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
import { ITeam, GenderSection } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { Season } from './season.model';
import { User } from '../user.model';
import { TeamPlayer } from './team-player.model';

export type CreationModelTeam = WithRequired<
  Partial<ITeam>,
  'clubId' | 'seasonId' | 'name' | 'genderSection'
>;

@Table({ tableName: 'titan_team', paranoid: false, timestamps: true })
export class Team extends CustomModel<ITeam, CreationModelTeam> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Club)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false)
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  category: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  division: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  pool: string | null;

  @AllowNull(false)
  @Default(GenderSection.MIXED)
  @Column({ type: DataType.ENUM(...Object.values(GenderSection)) })
  genderSection: GenderSection;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  federationTeamId: string | null;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Default(null)
  @Column({ type: DataType.UUID })
  coachId: string | null;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Default(null)
  @Column({ type: DataType.UUID })
  assistantCoachId: string | null;

  @BelongsTo(() => Club)
  club: Club;

  @BelongsTo(() => Season)
  season: Season;

  @BelongsTo(() => User, 'coachId')
  coach: User;

  @BelongsTo(() => User, 'assistantCoachId')
  assistantCoach: User;

  @HasMany(() => TeamPlayer)
  players: TeamPlayer[];
}
