import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaasController } from './saas.controller';
import {
  Drone,
  DroneSchema,
  History,
  HistorySchema,
  NoFlyZone,
  NoFlyZoneSchema,
  User,
  UserSchema,
} from './saas.schema';
import { ViewController } from './view.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Drone.name, schema: DroneSchema },
      { name: User.name, schema: UserSchema },
      { name: History.name, schema: HistorySchema },
      { name: NoFlyZone.name, schema: NoFlyZoneSchema },
    ]),
  ],
  controllers: [SaasController, ViewController],
})
export class SaasModule {}
