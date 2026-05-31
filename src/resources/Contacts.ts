import { HttpClient } from '../HttpClient';
import { ContactGroups, createContactGroups } from './ContactGroups';

export class Contacts {
  private _groups?: ContactGroups;

  constructor(private client: HttpClient) {}

  /**
   * Access contact groups:
   * - client.contacts.groups.list()
   * - client.contacts.groups.create('Group Name')
   * - client.contacts.groups('groupId').fetch()
   * - client.contacts.groups('groupId').update('New Name')
   * - client.contacts.groups('groupId').delete()
   * - client.contacts.groups('groupId').contacts.list()
   * - client.contacts.groups('groupId').contacts.create({ PHONE: '...', FIRST_NAME: '...' })
   * - client.contacts.groups('groupId').contacts('uid').fetch()
   * - client.contacts.groups('groupId').contacts('uid').update({ PHONE: '...' })
   * - client.contacts.groups('groupId').contacts('uid').delete()
   */
  public get groups(): ContactGroups {
    if (!this._groups) {
      this._groups = createContactGroups(this.client);
    }
    return this._groups;
  }
}
