import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanFriendlyMatch, FederationMatchStatus, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { FederationTeam } from '../federation/federation-team.model';
import { FederationVenue } from '../federation/federation-venue.model';
import { TitanFriendlyMatchLineup } from './friendly-match-lineup.model';
import { TitanFriendlyMatchEvent } from './friendly-match-event.model';

export type CreationModelTitanFriendlyMatch = WithRequired<
  Partial<ITitanFriendlyMatch>,
  'clubAccountId' | 'homeFederationTeamId' | 'awayFederationTeamId' | 'dateUtc' | 'ourSide'
>;

@Table({ tableName: 'titan_friendly_match', paranoid: false, timestamps: true })
export class TitanFriendlyMatch extends CustomModel<ITitanFriendlyMatch, CreationModelTitanFriendlyMatch> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  homeFederationTeamId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  awayFederationTeamId: string;

  @AllowNull(false) @Column({ type: DataType.DATE })
  dateUtc: string;

  @AllowNull(false) @Default(FederationMatchStatus.SCHEDULED)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchStatus)) })
  status: FederationMatchStatus;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreAway: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfAway: number | null;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => FederationVenue)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  ourSide: MatchSide;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => FederationTeam, { foreignKey: 'homeFederationTeamId', as: 'homeTeam' })
  homeTeam: FederationTeam;

  @BelongsTo(() => FederationTeam, { foreignKey: 'awayFederationTeamId', as: 'awayTeam' })
  awayTeam: FederationTeam;

  @BelongsTo(() => FederationVenue)
  venue: FederationVenue;

  @HasMany(() => TitanFriendlyMatchLineup)
  lineup: TitanFriendlyMatchLineup[];

  @HasMany(() => TitanFriendlyMatchEvent)
  events: TitanFriendlyMatchEvent[];
}
