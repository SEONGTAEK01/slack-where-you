import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('where-people')
  async getHello(): Promise<string> {
    return this.appService.getChannels();
  }

  @Get('/oauth/callback')
  async redirect(): Promise<string> {
    return 'Redirected';
  }
}
