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
import { IPlayer } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';
import { User } from '../user.model';
import { PlayerMatchStats } from './player-match-stats.model';
import { PlayerSeasonStats } from './player-season-stats.model';

export type CreationModelPlayer = WithRequired<
  Partial<IPlayer>,
  'clubId' | 'firstName' | 'lastName'
>;

@Table({ tableName: 'titan_player', paranoid: false, timestamps: true })
export class Player extends CustomModel<IPlayer, CreationModelPlayer> {
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
  @Column({ type: DataType.STRING })
  firstName: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  lastName: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  photo: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.DATEONLY })
  birthDate: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  nationality: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  licenseNumber: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  federationPlayerId: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive: boolean;

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string | null;

  @BelongsTo(() => Club)
  club: Club;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => PlayerMatchStats)
  matchStats: PlayerMatchStats[];

  @HasMany(() => PlayerSeasonStats)
  seasonStats: PlayerSeasonStats[];
}
