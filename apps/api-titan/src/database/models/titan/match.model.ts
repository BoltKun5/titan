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
import { IMatch, MatchStatus, MatchLocation } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Team } from './team.model';
import { Season } from './season.model';
import { Venue } from './venue.model';
import { MatchLineup } from './match-lineup.model';
import { MatchEvent } from './match-event.model';

export type CreationModelMatch = WithRequired<
  Partial<IMatch>,
  'teamId' | 'seasonId' | 'opponent' | 'date' | 'location'
>;

@Table({ tableName: 'titan_match', paranoid: false, timestamps: true })
export class Match extends CustomModel<IMatch, CreationModelMatch> {
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
  @ForeignKey(() => Season)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(true)
  @ForeignKey(() => Venue)
  @Default(null)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  opponent: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  date: string;

  @AllowNull(false)
  @Default(MatchStatus.SCHEDULED)
  @Column({ type: DataType.ENUM(...Object.values(MatchStatus)) })
  status: MatchStatus;

  @AllowNull(false)
  @Default(MatchLocation.HOME)
  @Column({ type: DataType.ENUM(...Object.values(MatchLocation)) })
  location: MatchLocation;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  scoreHome: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  scoreAway: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  scoreHalfHome: number | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  scoreHalfAway: number | null;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isFriendly: boolean;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => Team)
  team: Team;

  @BelongsTo(() => Season)
  season: Season;

  @BelongsTo(() => Venue)
  venue: Venue;

  @HasMany(() => MatchLineup)
  lineup: MatchLineup[];

  @HasMany(() => MatchEvent)
  events: MatchEvent[];
}
