import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  Login(@Body() data: { gmail: string; password: string }) {

    return this.adminService.login(data.gmail, data.password);
  }
}