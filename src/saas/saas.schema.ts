import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { randomUUID } from 'node:crypto';

@Schema()
export class Drone extends Document {
//   @Prop({ type: Types.ObjectId, auto: true, default: randomUUID() })
//   _id: Types.ObjectId;

  @Prop({ required: true })
  droneModel: string;

  @Prop({ required: true })
  serial_number: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: User | Types.ObjectId;
}

export const DroneSchema = SchemaFactory.createForClass(Drone);

@Schema()
export class User extends Document {
//   @Prop({ type: Types.ObjectId, auto: true })
//   _id?: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  is_company: boolean;

  @Prop({ default: false })
  is_admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class History extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Drone' })
  drone_id: Drone | Types.ObjectId;

  @Prop()
  x: number;

  @Prop()
  y: number;

  @Prop()
  height: number;

  @Prop()
  time: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);

@Schema()
export class NoFlyZone extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  x1: number;

  @Prop()
  y1: number;

  @Prop()
  x2: number;

  @Prop()
  y2: number;

  @Prop()
  height: number;
}

export const NoFlyZoneSchema = SchemaFactory.createForClass(NoFlyZone);
