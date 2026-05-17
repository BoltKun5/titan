import {
  DataType, Column, Table,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import {
  IFederationPlayerHandball, HandballPlayerPosition,
  FederationShootingHand,
} from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayer } from '../federation-player.model';

export type CreationModelFederationPlayerHandball = WithRequired<
  Partial<IFederationPlayerHandball>,
  'playerId'
>;

@Table({ tableName: 'federation_player_handball', paranoid: false, timestamps: true })
export class FederationPlayerHandball extends CustomModel<IFederationPlayerHandball, CreationModelFederationPlayerHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  playerId: string;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(HandballPlayerPosition))),
    defaultValue: [],
  })
  positions: HandballPlayerPosition[];

  @AllowNull(true) @Column({ type: DataType.ENUM(...Object.values(FederationShootingHand)) })
  shootingHand: FederationShootingHand | null;

  @AllowNull(true) @Column({ type: DataType.INTEGER })
  preferredJerseyNumber: number | null;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
