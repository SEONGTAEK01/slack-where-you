import { Injectable } from "@nestjs/common";
import { WebClient } from "@slack/web-api";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";

import * as fs from "fs";

@Injectable()
export class AppService {
  private readonly client: WebClient;
  private userNameList: { [x: string]: any };

  constructor() {
    console.log("Initiating Slack API client...");

    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.userNameList = this.loadAllUserInfo();
  }

  async getWherePeople(userId: string, targetName: string): Promise<any> {
    const threadFound = await this.findLatestThread();
    const replies = await this.getReplies(threadFound);
    const userStatus = await this.findUserStatus(userId, replies);
    const result = await this.formatUserStatus(userStatus, targetName);

    console.log(result);
    return result;
  }

  async getReplies(threadFound: Message): Promise<any> {
    try {
      const replies = await this.client.conversations.replies({
        channel: process.env.DAILY_CHECKIN_CHANNEL,
        ts: threadFound.thread_ts,
      });
      return replies;
    } catch (error) {
      console.error(error);
    }
  }

  async getConversationHistory(): Promise<any> {
    try {
      const history = this.client.conversations.history({
        channel: process.env.DAILY_CHECKIN_CHANNEL,
        limit: 5,
      });
      return history;
    } catch (error) {
      console.error(error);
    }
  }

  async findLatestThread(): Promise<any> {
    try {
      const response = await this.getConversationHistory();
      const threadFound = response.messages.find(
        (msg: { text: any; thread_ts: any }) => msg.text && msg.thread_ts
      );
      return threadFound;
    } catch (error) {
      console.error(error);
    }
  }

  async findUserStatus(
    userId: string,
    replies: { messages: any[] }
  ): Promise<any> {
    replies.messages.reverse();

    try {
      const userStatus = replies.messages.find(
        (msg) => msg.user === userId && msg.parent_user_id
      );
      return userStatus;
    } catch (error) {
      console.error(error);
    }
  }

  loadAllUserInfo() {
    console.log("Loading user name by ID...");
    const data = fs.readFileSync(process.env.USER_ID_LIST_PATH, "utf8");
    const users: { [key: string]: string } = JSON.parse(data);

    console.log(users);
    return users;
  }

  getUserIdFromName(name: string) {
    return this.userNameList[name];
  }

  isUndefined(value: any) {
    return value === undefined || value === null;
  }

  async formatUserStatus(
    userStatus: {
      ts: string;
      text: string;
    },
    targetName: string
  ): Promise<string> {
    if (this.isUndefined(userStatus)) {
      return `${targetName} 님은 출근 전 입니다.`;
    } else {
      const humanReadableTime = await this.getKoreaStandardTime(userStatus.ts);
      return `[${humanReadableTime}] (${targetName}) ${userStatus.text}`;
    }
  }

  async getKoreaStandardTime(timestamp: string): Promise<string> {
    const utcTime = parseFloat(timestamp);
    const date = new Date(utcTime * 1000);

    const timeDiff = 9 * 60 * 60 * 1000;
    const newUtcTime = date.getTime() + timeDiff;
    const newDate = new Date(newUtcTime);
    const formatNewDate = newDate.toLocaleString();

    return formatNewDate;
  }
}
