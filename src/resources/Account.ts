import { HttpClient } from '../HttpClient';
import { SwiftsmsResponse, BalanceData, ProfileData } from '../interfaces';

export class Account {
  constructor(private client: HttpClient) {}

  /**
   * View sms credit balance
   */
  public async balance(): Promise<SwiftsmsResponse<BalanceData>> {
    return this.client.request<SwiftsmsResponse<BalanceData>>('get', '/balance');
  }

  /**
   * View profile
   */
  public async profile(): Promise<SwiftsmsResponse<ProfileData>> {
    return this.client.request<SwiftsmsResponse<ProfileData>>('get', '/me');
  }
}
