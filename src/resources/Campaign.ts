import { HttpClient } from '../HttpClient';
import { SwiftsmsResponse } from '../interfaces';

export class Campaign {
  constructor(private client: HttpClient) {}

  /**
   * View a campaign by UID
   * @param uid - The unique campaign UID
   */
  public async view(uid: string): Promise<SwiftsmsResponse> {
    if (!uid) {
      throw new Error('Campaign UID cannot be empty');
    }
    return this.client.request<SwiftsmsResponse>('get', `/campaign/${uid}/view`);
  }
}
