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
import { IVenue } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Club } from './club.model';

export type CreationModelVenue = WithRequired<
  
 

  Partial<IVenue>,
  'clubId' | 'name'
>;

@Table({ tableName: 'titan_venue', paranoid: false, timestamps: true })
export class Venue extends CustomModel<IVenue, CreationModelVenue> {
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
  name: string;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.STRING })
  address: string | null;

  @AllowNull(true)
  @Default(null)
  @Column({ type: DataType.INTEGER })
  capacity: number | null;

  @BelongsTo(() => Club)
  club: Club;
}
