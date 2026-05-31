export interface SwiftsmsResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  code?: number;
}

export interface SmsData {
  uid: string;
  to: string;
  from: string;
  message: string;
  sms_type: string;
  direction: string;
  status: string;
  sms_count: number;
  cost: string;
  sent_at: string;
}

export interface SmsListParams {
  start_date?: string;  // Format: YYYY-MM-DD HH:MM:SS
  end_date?: string;    // Format: YYYY-MM-DD HH:MM:SS
  timezone?: string;    // IANA timezone e.g. Asia/Hong_Kong
  sms_type?: 'plain' | 'unicode' | 'voice' | 'mms' | 'whatsapp' | 'otp' | 'viber';
  direction?: 'outgoing' | 'incoming' | 'api';
}

export interface SmsOptions {
  sender_id?: string;
  schedule_time?: string;   // Format: Y-m-d H:i
  dlt_template_id?: string;
}

export interface VoiceOptions {
  sender_id?: string;
  schedule_time?: string;
}

export interface MmsOptions {
  sender_id?: string;
  schedule_time?: string;
}

export interface WhatsAppOptions {
  sender_id?: string;
  schedule_time?: string;
  media_url?: string;
}

export interface ViberOptions {
  sender_id?: string;
  schedule_time?: string;
  media_url?: string;
}

export interface OtpOptions {
  sender_id?: string;
  schedule_time?: string;
}

export interface CampaignOptions {
  sender_id?: string;
  schedule_time?: string;
  dlt_template_id?: string;
}

export interface BalanceData {
  remaining_balance: number;
  currency: string;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface GroupData {
  uid: string;
  name: string;
  total_contact: number;
  created_at: string;
}

export interface ContactData {
  uid: string;
  PHONE: string;
  FIRST_NAME?: string;
  LAST_NAME?: string;
  [key: string]: any; // For custom fields
}

export interface ContactPayload {
  PHONE: string;
  FIRST_NAME?: string;
  LAST_NAME?: string;
  [key: string]: any; // For other custom fields
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  total: number;
  to: number;
}
