import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("where-people")
  async getWherePeople(): Promise<string> {
    return this.appService.getWherePeople();
  }

  @Get("/oauth/callback")
  async redirect(): Promise<string> {
    return "Redirected";
  }
}
