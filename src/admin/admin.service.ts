import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './admin.schema.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async login(gmail: string, password: string) {
    

    const admin = await this.adminModel.findOne({ gmail });


    if (!admin) {
      throw new UnauthorizedException('Invalid Gmail or password');
    }

            const isPasswordValid = await bcrypt.compare(
                 password,
                 admin.password,
            );

            if (!isPasswordValid) {
              throw new UnauthorizedException('Invalid Gmail or password');
             }


    return {
      message: 'Login successful',
      admin: {
        username: admin.username,
        gmail: admin.gmail,
      },
    };
  }
}