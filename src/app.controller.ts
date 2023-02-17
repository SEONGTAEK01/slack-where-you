import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("where-people")
  async getWherePeople(@Body() body: any): Promise<string> {
    const targetName = body.text;
    const userId = await this.appService.getUserIdFromName(targetName);
    if (this.appService.isUndefined(userId)) {
      return "룩시드랩스에 존재하지 않는 동료 입니다 :)";
    }

    return await this.appService.getWherePeople(userId, targetName);
  }

  @Get("/oauth/callback")
  async redirect(): Promise<string> {
    return "Redirected";
  }
}
