import { HttpClient } from '../HttpClient';
import { formatPhone, validateMessagePayload } from '../utils/helpers';
import {
  SwiftsmsResponse,
  SmsData,
  SmsOptions,
  SmsListParams,
  CampaignOptions,
  PaginatedData,
} from '../interfaces';

export class Sms {
  constructor(private client: HttpClient, private senderId: string) {}

  /**
   * Send single or group SMS
   * @param phones - Phone number(s). Use comma-separated string or array.
   * @param message - The body of the SMS message.
   * @param options - Optional: sender_id, schedule_time, dlt_template_id
   */
  public async send(
    phones: string | string[],
    message: string,
    options: SmsOptions = {}
  ): Promise<SwiftsmsResponse<SmsData>> {
    validateMessagePayload(phones, message);

    const payload = {
      recipient: formatPhone(phones),
      sender_id: options.sender_id || this.senderId,
      type: 'plain',
      message,
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
      ...(options.dlt_template_id && { dlt_template_id: options.dlt_template_id }),
    };

    return this.client.request<SwiftsmsResponse<SmsData>>('post', '/sms/send', payload);
  }

  /**
   * Send a campaign to one or more contact lists
   * @param contactListIds - Contact list UID(s). Use comma-separated string or array.
   * @param message - The body of the SMS message.
   * @param options - Optional: sender_id, schedule_time, dlt_template_id
   */
  public async sendCampaign(
    contactListIds: string | string[],
    message: string,
    options: CampaignOptions = {}
  ): Promise<SwiftsmsResponse> {
    if (!contactListIds || contactListIds.length === 0) {
      throw new Error('Contact list ID(s) cannot be empty');
    }
    if (!message) {
      throw new Error('Message cannot be empty');
    }

    const recipient = Array.isArray(contactListIds)
      ? contactListIds.join(',')
      : contactListIds;

    const payload = {
      recipient,
      sender_id: options.sender_id || this.senderId,
      type: 'plain',
      message,
      ...(options.schedule_time && { schedule_time: options.schedule_time }),
      ...(options.dlt_template_id && { dlt_template_id: options.dlt_template_id }),
    };

    return this.client.request<SwiftsmsResponse>('post', '/sms/campaign', payload);
  }

  /**
   * View a single SMS by UID
   */
  public async view(uid: string): Promise<SwiftsmsResponse<SmsData>> {
    if (!uid) {
      throw new Error('UID cannot be empty');
    }
    return this.client.request<SwiftsmsResponse<SmsData>>('get', `/sms/${uid}`);
  }

  /**
   * List all SMS messages with optional date/type/timezone filters
   */
  public async list(params: SmsListParams = {}): Promise<SwiftsmsResponse<PaginatedData<SmsData>>> {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.timezone) query.append('timezone', params.timezone);
    if (params.sms_type) query.append('sms_type', params.sms_type);
    if (params.direction) query.append('direction', params.direction);

    const url = `/sms${query.toString() ? `?${query.toString()}` : ''}`;
    return this.client.request<SwiftsmsResponse<PaginatedData<SmsData>>>('get', url);
  }
}
