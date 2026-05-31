import { HttpClient } from '../HttpClient';
import { formatPhone, validateMessagePayload } from '../utils/helpers';
import { SwiftsmsResponse, SmsData, OtpOptions } from '../interfaces';

export class Otp {
  constructor(private client: HttpClient, private senderId: string) {}

  /**
   * Send an OTP message
   * @param phones - Phone number(s)
   * @param message - The OTP message body
   * @param options - Optional: sender_id, schedule_time
   */
  public async send(
    phones: string | string[],
    message: string,
    options: OtpOptions = {}
  ): Promise<SwiftsmsResponse<SmsData>> {
    validateMessagePayload(phones, message);

    const payload = {
      recipient: formatPhone(phones),
      sender_id: options.sender_id || this.senderId,
      type: 'otp',
      message,
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
    };

    return this.client.request<SwiftsmsResponse<SmsData>>('post', '/sms/send', payload);
  }
}
