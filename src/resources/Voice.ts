import { HttpClient } from '../HttpClient';
import { formatPhone, validateMessagePayload } from '../utils/helpers';
import { SwiftsmsResponse, SmsData, VoiceOptions } from '../interfaces';

export type VoiceLanguage =
  | 'cy-gb' | 'da-dk' | 'de-de' | 'el-gr' | 'en-au' | 'en-gb' | 'en-gb-wls'
  | 'en-in' | 'en-us' | 'es-es' | 'es-mx' | 'es-us' | 'fr-ca' | 'fr-fr'
  | 'id-id' | 'is-is' | 'it-it' | 'ja-jp' | 'ko-kr' | 'ms-my' | 'nb-no'
  | 'nl-nl' | 'pl-pl' | 'pt-br' | 'pt-pt' | 'ro-ro' | 'ru-ru' | 'sv-se'
  | 'ta-in' | 'th-th' | 'tr-tr' | 'vi-vn' | 'zh-cn' | 'zh-hk';

export class Voice {
  constructor(private client: HttpClient, private senderId: string) {}

  /**
   * Send a Voice SMS
   * @param phones - Phone number(s)
   * @param message - Text to be read to the recipient
   * @param gender - Voice gender: 'male' or 'female'
   * @param language - Language code e.g. 'en-gb', 'fr-fr'
   * @param options - Optional: sender_id, schedule_time
   */
  public async send(
    phones: string | string[],
    message: string,
    gender: 'male' | 'female' = 'female',
    language: VoiceLanguage = 'en-gb',
    options: VoiceOptions = {}
  ): Promise<SwiftsmsResponse<SmsData>> {
    validateMessagePayload(phones, message);

    const payload = {
      recipient: formatPhone(phones),
      sender_id: options.sender_id || this.senderId,
      type: 'voice',
      language,
      gender,
      message,
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
    };

    return this.client.request<SwiftsmsResponse<SmsData>>('post', '/sms/send', payload);
  }
}
