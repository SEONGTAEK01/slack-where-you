import { Injectable } from "@nestjs/common";
import { WebClient } from "@slack/web-api";
import { userInfo } from "os";

@Injectable()
export class AppService {
  private readonly client: WebClient;

  constructor() {
    console.log("Initiating Slack API client...");
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async getWherePeople(): Promise<any> {
    // const response = await this.client.conversations.list();
    // if (response.ok) {
    //   return response.channels;
    // } else {
    //   throw new Error("Failed to fetch channels");
    // }
    // Get the latest daily checkin thread
    const response = await this.client.conversations.history({
      channel: process.env.DAILY_CHECKIN_CHANNEL,
      limit: 5,
    });

    const threadFound = response.messages.find(
      (msg) => msg.text && msg.thread_ts
    );
    console.log(threadFound);

    try {
      const replies = await this.client.conversations.replies({
        channel: process.env.DAILY_CHECKIN_CHANNEL,
        ts: threadFound.thread_ts,
      });
      console.log(replies.messages);

      // Find target-id in replies
      const userId = "U020G9ZRH0E";
      replies.messages.reverse();
      const userStatus = replies.messages.find(
        (msg) => msg.user === userId && msg.parent_user_id
      );
      console.log("userStatus: " + userStatus.text);
      return userStatus;
    } catch (error) {
      console.error(error);
    }

    // Get the latest checkin status of target-id
    // Display found status
  }
}
