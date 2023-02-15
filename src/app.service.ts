import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class AppService {
  private readonly client: WebClient;

  constructor() {
    console.log('Initiating Slack API client...');
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async getChannels(): Promise<any> {
    const response = await this.client.conversations.list();
    if (response.ok) {
      return response.channels;
    } else {
      throw new Error('Failed to fetch channels');
    }
  }
}
