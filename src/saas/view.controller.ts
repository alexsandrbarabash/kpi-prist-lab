import { Controller, Get, Render, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Drone, User, History } from './saas.schema';
import { Model, Types } from 'mongoose';

@Controller()
export class ViewController {
  constructor(
    @InjectModel(Drone.name) private droneModel: Model<Drone>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  @Get('/login')
  @Render('login')
  login() {}

  @Get('/home/:userId')
  @Render('home')
  async home(@Param('userId') userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const drones = await this.droneModel.find({
      user_id: user?._id,
    });

    return { userId, drones, userEmail: user?.email };
  }

  @Get('/login')
  @Render('register')
  register() {}

  @Get('/add-drone/:userId')
  @Render('add-drone')
  addDroneRender(@Param('userId') userId: string) {
    return { userId };
  }

  @Get('/api/my/drones/:droneId')
  @Render('drone')
  async getDroneRender(@Param('droneId') droneId: string) {
    const history = await this.historyModel.find({
      drone_id: new Types.ObjectId(droneId),
    });

    const drone = await this.droneModel.find({
      _id: new Types.ObjectId(droneId),
    });

    // @ts-ignore
    return { ...drone[0]._doc, history };
  }

  @Get('/home/my/drones/:droneId')
  @Render('drone')
  async getHomeDroneRender(@Param('droneId') droneId: string) {
    const history = await this.historyModel.find({
      drone_id: new Types.ObjectId(droneId),
    });

    const drone = await this.droneModel.find({
      _id: new Types.ObjectId(droneId),
    });

    // @ts-ignore
    return { ...drone[0]._doc, history };
  }

  @Get('/api/drones/my/drones/:droneId')
  @Render('drone')
  async getApiDroneRender(@Param('droneId') droneId: string) {
    const history = await this.historyModel.find({
      drone_id: new Types.ObjectId(droneId),
    });

    const drone = await this.droneModel.find({
      _id: new Types.ObjectId(droneId),
    });

    // @ts-ignore
    return { ...drone[0]._doc, history };
  }
}
