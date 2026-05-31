import { HttpClient } from '../HttpClient';
import { formatPhone, validateMessagePayload } from '../utils/helpers';
import { SwiftsmsResponse, SmsData, MmsOptions } from '../interfaces';

export class Mms {
  constructor(private client: HttpClient, private senderId: string) {}

  /**
   * Send MMS with a media attachment
   * @param phones - Phone number(s)
   * @param message - Optional body text (message is optional for MMS)
   * @param mediaUrl - URL of the media attachment (image/*)
   * @param options - Optional: sender_id, schedule_time
   */
  public async send(
    phones: string | string[],
    message: string,
    mediaUrl: string,
    options: MmsOptions = {}
  ): Promise<SwiftsmsResponse<SmsData>> {
    if (!phones || phones.length === 0) {
      throw new Error('Phones cannot be empty');
    }
    if (!mediaUrl) {
      throw new Error('Media URL cannot be empty for MMS');
    }

    const payload = {
      recipient: formatPhone(phones),
      sender_id: options.sender_id || this.senderId,
      type: 'mms',
      message,
      media_url: mediaUrl,
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
    };

    return this.client.request<SwiftsmsResponse<SmsData>>('post', '/sms/send', payload);
  }
}
