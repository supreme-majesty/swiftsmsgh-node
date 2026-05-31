import { HttpClient, HttpClientOptions } from './HttpClient';
import { Sms } from './resources/Sms';
import { Voice } from './resources/Voice';
import { Mms } from './resources/Mms';
import { Otp } from './resources/Otp';
import { WhatsApp } from './resources/WhatsApp';
import { Viber } from './resources/Viber';
import { Account } from './resources/Account';
import { Contacts } from './resources/Contacts';
import { Campaign } from './resources/Campaign';

export class Swiftsmsgh {
  public httpClient: HttpClient;
  public senderId?: string;

  private _sms?: Sms;
  private _voice?: Voice;
  private _mms?: Mms;
  private _otp?: Otp;
  private _whatsapp?: WhatsApp;
  private _viber?: Viber;
  private _account?: Account;
  private _contacts?: Contacts;
  private _campaign?: Campaign;

  constructor(apiToken?: string, senderId?: string, options?: HttpClientOptions) {
    const token = apiToken || process.env.SWIFTSMS_API_TOKEN;
    this.senderId = senderId || process.env.SWIFTSMS_SENDER_ID;

    if (!token) {
      throw new Error(
        'API token is required. Pass it to the constructor or set SWIFTSMS_API_TOKEN environment variable.'
      );
    }

    this.httpClient = new HttpClient(token, options);
  }

  /** Access details about the last request made (for debugging) */
  get lastRequest() {
    return this.httpClient.lastRequest;
  }

  /** Send SMS, campaigns, and list messages */
  get sms(): Sms {
    if (!this._sms) this._sms = new Sms(this.httpClient, this.senderId || '');
    return this._sms;
  }

  /** Send voice calls */
  get voice(): Voice {
    if (!this._voice) this._voice = new Voice(this.httpClient, this.senderId || '');
    return this._voice;
  }

  /** Send MMS with media attachments */
  get mms(): Mms {
    if (!this._mms) this._mms = new Mms(this.httpClient, this.senderId || '');
    return this._mms;
  }

  /** Send OTP messages */
  get otp(): Otp {
    if (!this._otp) this._otp = new Otp(this.httpClient, this.senderId || '');
    return this._otp;
  }

  /** Send WhatsApp messages */
  get whatsapp(): WhatsApp {
    if (!this._whatsapp) this._whatsapp = new WhatsApp(this.httpClient, this.senderId || '');
    return this._whatsapp;
  }

  /** Send Viber messages */
  get viber(): Viber {
    if (!this._viber) this._viber = new Viber(this.httpClient, this.senderId || '');
    return this._viber;
  }

  /** Check balance and view profile */
  get account(): Account {
    if (!this._account) this._account = new Account(this.httpClient);
    return this._account;
  }

  /** Manage contacts and contact groups */
  get contacts(): Contacts {
    if (!this._contacts) this._contacts = new Contacts(this.httpClient);
    return this._contacts;
  }

  /** View campaigns */
  get campaign(): Campaign {
    if (!this._campaign) this._campaign = new Campaign(this.httpClient);
    return this._campaign;
  }
}
