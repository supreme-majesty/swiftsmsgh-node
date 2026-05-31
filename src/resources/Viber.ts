import { HttpClient } from '../HttpClient';
import { formatPhone, validateMessagePayload } from '../utils/helpers';
import { SwiftsmsResponse, SmsData, ViberOptions } from '../interfaces';

export class Viber {
  constructor(private client: HttpClient, private senderId: string) {}

  /**
   * Send a Viber message
   * @param phones - Phone number(s)
   * @param message - The message body
   * @param options - Optional: sender_id, schedule_time, media_url
   */
  public async send(
    phones: string | string[],
    message: string,
    options: ViberOptions = {}
  ): Promise<SwiftsmsResponse<SmsData>> {
    validateMessagePayload(phones, message);

    const payload = {
      recipient: formatPhone(phones),
      sender_id: options.sender_id || this.senderId,
      type: 'viber',
      message,
      ...(options.media_url && { media_url: options.media_url }),
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
    };

    return this.client.request<SwiftsmsResponse<SmsData>>('post', '/sms/send', payload);
  }
}
