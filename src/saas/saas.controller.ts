import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
  Render,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  Drone,
  User,
  History,
  NoFlyZone,
} from './saas.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const secretKey = 'yourSecretKey'; // Replace with your secret key
      jwt.verify(token, secretKey);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

class CreateDroneDto {
  readonly droneModel: string;
  readonly serial_number: string;
  // readonly user_id: string;
}

class UpdateDroneDto {
  readonly droneModel?: string;
  readonly serial_number?: string;
  readonly user_id?: string;
}

class CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly is_company?: boolean;
  readonly is_admin?: boolean;
}

class UpdateUserDto {
  readonly email?: string;
  readonly name?: string;
  readonly password?: string;
  readonly is_company?: boolean;
  readonly is_admin?: boolean;
}

class CreateHistoryDto {
  readonly drone_id: string;
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly time: Date;
}

class UpdateHistoryDto {
  readonly drone_id?: string;
  readonly x?: number;
  readonly y?: number;
  readonly height?: number;
  readonly time?: Date;
}

class CreateNoFlyZoneDto {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly height: number;
}

class UpdateNoFlyZoneDto {
  readonly x1?: number;
  readonly y1?: number;
  readonly x2?: number;
  readonly y2?: number;
  readonly height?: number;
}

class RegisterUserDto {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

class LoginUserDto {
  readonly email: string;
  readonly password: string;
}

@Controller('api')
export class SaasController {
  constructor(
    @InjectModel(Drone.name) private droneModel: Model<Drone>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(History.name) private historyModel: Model<History>,
    @InjectModel(NoFlyZone.name) private noFlyZoneModel: Model<NoFlyZone>,
  ) {}

  @Post('register')
  @Render('home')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const newUser = new this.userModel(registerUserDto);
    // return newUser.save();
    return { userId: newUser.id, drones: [], userEmail: registerUserDto.email };
  }

  @Post('login')
  @Render('home')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    // Logic for user authentication
    const user = await this.userModel.findOne({ email: loginUserDto.email });

    if (
      user &&
      (await this.validatePassword(loginUserDto.password, user.password))
    ) {
      // Create JWT token
      const payload = { email: user.email, sub: user._id };
      const secretKey = 'yourSecretKey'; // Use an environment variable for the secret key
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      const drones = await this.droneModel.find({ user_id: user._id });

      return { userId: user.id, drones, userEmail: loginUserDto.email };
    } else {
      // Handle invalid credentials
      return { message: 'Invalid credentials' };
    }
  }

  private async validatePassword(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    // Implement password validation logic
    return enteredPassword === storedPassword; // Replace with actual validation
  }

  // @UseGuards(JwtAuthGuard)
  @Get('drones')
  async findAllDrones(): Promise<Drone[]> {
    return this.droneModel.find().exec();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('drones/:id')
  @Render('home')
  async findDroneById(@Param('id') id: string): Promise<any> {
    return this.droneModel.findById(id).exec();
  }

  // @UseGuards(JwtAuthGuard)
  @Render('drone')
  @Put('drones/:id')
  async updateDrone(
    @Param('id') id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ): Promise<any> {
    return this.droneModel
      .findByIdAndUpdate(id, updateDroneDto, { new: true })
      .exec();
  }

  @Post('drones/:userId')
  @Render('home')
  async createDrone(
    @Param('userId') userId: string,
    @Body() createDroneDto: CreateDroneDto,
  ) {
    const createdDrone = new this.droneModel(createDroneDto);

    createdDrone.user_id = new Types.ObjectId(userId);

    const drone = await createdDrone.save();

    const history1 = new this.historyModel({
      drone_id: drone._id,
      x: 50.5,
      y: 50.5,
    });

    const history2 = new this.historyModel({
      drone_id: drone._id,
      x: 50.5,
      y: 50.5,
    });

    const history3 = new this.historyModel({
      drone_id: drone._id,
      x: 50.5,
      y: 50.5,
    });

    const history4 = new this.historyModel({
      drone_id: drone._id,
      x: 50.5,
      y: 50.5,
    });

    const history5 = new this.historyModel({
      drone_id: drone._id,
      x: 50.5,
      y: 50.5,
    });

    await this.historyModel.create([
      history1,
      history2,
      history3,
      history4,
      history5,
    ]);

    const drones = await this.droneModel.find({
      user_id: createdDrone.user_id,
    });

    const user = await this.userModel.findOne({ _id: createdDrone.user_id });

    return { userId: createdDrone.user_id, drones, userEmail: user?.email };
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('drones/:id')
  async deleteDrone(@Param('id') id: string): Promise<any> {
    return this.droneModel.findByIdAndRemove(id).exec();
  }

  // ... Add other Drone CRUD methods here ...

  // CRUD operations for Users

  // @Post('users')
  // async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   const createdUser = new this.userModel(createUserDto);
  //   return createdUser.save();
  // }

  // @UseGuards(JwtAuthGuard)
  @Get('users')
  async findAllUsers(): Promise<any[]> {
    return this.userModel.find().exec();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async findUserById(@Param('id') id: string): Promise<any> {
    return this.userModel.findById(id).exec();
  }

  // @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  // ... Add other User CRUD methods here ...

  // CRUD operations for History
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async findAllHistory(): Promise<any[]> {
    return this.historyModel.find().exec();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  async findHistoryById(@Param('id') id: string): Promise<any> {
    return this.historyModel.findById(id).exec();
  }

  @UseGuards(JwtAuthGuard)
  @Put('history/:id')
  async updateHistory(
    @Param('id') id: string,
    @Body() updateHistoryDto: UpdateHistoryDto,
  ): Promise<any> {
    return this.historyModel
      .findByIdAndUpdate(id, updateHistoryDto, { new: true })
      .exec();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history/:id')
  async deleteHistory(@Param('id') id: string): Promise<any> {
    return this.historyModel.findByIdAndRemove(id).exec();
  }

  // ... Add other History CRUD methods here ...

  // CRUD operations for NoFlyZones

  // ... Add other NoFlyZone CRUD methods here ...
  @UseGuards(JwtAuthGuard)
  @Post('noflyzones')
  async createNoFlyZone(
    @Body() createNoFlyZoneDto: CreateNoFlyZoneDto,
  ): Promise<NoFlyZone> {
    const createdNoFlyZone = new this.noFlyZoneModel(createNoFlyZoneDto);
    return createdNoFlyZone.save();
  }

  @UseGuards(JwtAuthGuard)
  @Get('noflyzones')
  async findAllNoFlyZones(): Promise<any[]> {
    return this.noFlyZoneModel.find().exec();
  }

  @UseGuards(JwtAuthGuard)
  @Get('noflyzones/:id')
  async findNoFlyZoneById(@Param('id') id: string): Promise<any> {
    return this.noFlyZoneModel.findById(id).exec();
  }

  @UseGuards(JwtAuthGuard)
  @Put('noflyzones/:id')
  async updateNoFlyZone(
    @Param('id') id: string,
    @Body() updateNoFlyZoneDto: UpdateNoFlyZoneDto,
  ): Promise<any> {
    return this.noFlyZoneModel
      .findByIdAndUpdate(id, updateNoFlyZoneDto, { new: true })
      .exec();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('noflyzones/:id')
  async deleteNoFlyZone(@Param('id') id: string): Promise<any> {
    return this.noFlyZoneModel.findByIdAndRemove(id).exec();
  }
}
