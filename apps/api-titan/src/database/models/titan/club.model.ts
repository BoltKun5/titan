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
import { IClub, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Season } from './season.model';
import { Venue } from './venue.model';
import { ClubMember } from './club-member.model';
import { Team } from './team.model';

export type CreationModelClub = WithRequired<Partial<IClub>, 'name' | 'sport'>;

@Table({ tableName: 'titan_club', paranoid: false, timestamps: true })
export class Club extends CustomModel<IClub, CreationModelClub> {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  logo: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.JSON })
  colors: string[] | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  address: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  phone: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  email: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  website: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  federationId: string | null;

  @AllowNull(false)
  @Default(SportType.HANDBALL)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @HasMany(() => Season)
  seasons: Season[];

  @HasMany(() => Venue)
  venues: Venue[];

  @HasMany(() => ClubMember)
  members: ClubMember[];

  @HasMany(() => Team)
  teams: Team[];
}
