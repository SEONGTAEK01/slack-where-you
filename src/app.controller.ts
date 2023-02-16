import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("where-people")
  async getWherePeople(@Body() body: any): Promise<string> {
    console.log(body);
    return this.appService.getWherePeople("U7QALSDL5");
  }

  @Get("/oauth/callback")
  async redirect(): Promise<string> {
    return "Redirected";
  }
}
