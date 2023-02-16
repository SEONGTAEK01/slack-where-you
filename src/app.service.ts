import { Injectable } from "@nestjs/common";
import { WebClient } from "@slack/web-api";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";

@Injectable()
export class AppService {
  private readonly client: WebClient;

  constructor() {
    console.log("Initiating Slack API client...");
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async getWherePeople(userName: string): Promise<any> {
    const threadFound = await this.findLatestThread();
    const replies = await this.getReplies(threadFound);
    const userStatus = await this.findUserStatus(userName, replies);

    return userStatus;
  }

  async getReplies(threadFound: Message): Promise<any> {
    try {
      const replies = await this.client.conversations.replies({
        channel: process.env.DAILY_CHECKIN_CHANNEL,
        ts: threadFound.thread_ts,
      });
      console.log(replies);
      return replies;
    } catch (error) {
      console.error(error);
    }
  }

  async getConversationHistory(): Promise<any> {
    return this.client.conversations.history({
      channel: process.env.DAILY_CHECKIN_CHANNEL,
      limit: 5,
    });
  }

  async findLatestThread(): Promise<any> {
    const response = await this.getConversationHistory();
    const threadFound = response.messages.find(
      (msg: { text: any; thread_ts: any }) => msg.text && msg.thread_ts
    );
    console.log(threadFound);
    return threadFound;
  }

  async findUserStatus(
    userId: string,
    replies: { messages: any[] }
  ): Promise<any> {
    console.log("====================================");
    console.log(replies.messages);
    replies.messages.reverse();
    const userStatus = replies.messages.find(
      (msg) => msg.user === userId && msg.parent_user_id
    );
    console.log("userStatus: " + userStatus.text);
    return userStatus;
  }
}
