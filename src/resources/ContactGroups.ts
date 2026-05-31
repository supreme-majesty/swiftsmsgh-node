import { HttpClient } from '../HttpClient';
import { SwiftsmsResponse, GroupData, ContactData, ContactPayload, PaginatedData } from '../interfaces';

// ─── Contact Groups ───────────────────────────────────────────────────────────

export interface ContactGroups {
  (groupId: string): ContactGroupContext;
  list(): Promise<SwiftsmsResponse<PaginatedData<GroupData>>>;
  create(name: string): Promise<SwiftsmsResponse<GroupData>>;
}

export function createContactGroups(client: HttpClient): ContactGroups {
  const groupsFunc = function (groupId: string) {
    return new ContactGroupContext(client, groupId);
  } as ContactGroups;

  /**
   * View all contact groups (GET /contacts)
   */
  groupsFunc.list = async function () {
    return client.request<SwiftsmsResponse<PaginatedData<GroupData>>>('get', '/contacts');
  };

  /**
   * Create a new contact group (POST /contacts with { name })
   */
  groupsFunc.create = async function (name: string) {
    if (!name) {
      throw new Error('Group name cannot be empty');
    }
    return client.request<SwiftsmsResponse<GroupData>>('post', '/contacts', { name });
  };

  return groupsFunc;
}

// ─── Contact Group Context (scoped to a groupId) ─────────────────────────────

export class ContactGroupContext {
  private _contacts?: GroupContacts;

  constructor(private client: HttpClient, private groupId: string) {}

  /**
   * View a contact group (GET /contacts/{group_id}/show)
   */
  public async fetch(): Promise<SwiftsmsResponse<GroupData>> {
    if (!this.groupId) throw new Error('Group ID cannot be empty');
    return this.client.request<SwiftsmsResponse<GroupData>>('get', `/contacts/${this.groupId}/show`);
  }

  /**
   * Update a contact group name (PATCH /contacts/{group_id} with { name })
   */
  public async update(name: string): Promise<SwiftsmsResponse<GroupData>> {
    if (!name) throw new Error('Group name cannot be empty');
    return this.client.request<SwiftsmsResponse<GroupData>>('patch', `/contacts/${this.groupId}`, { name });
  }

  /**
   * Delete a contact group (DELETE /contacts/{group_id})
   */
  public async delete(): Promise<SwiftsmsResponse> {
    if (!this.groupId) throw new Error('Group ID cannot be empty');
    return this.client.request<SwiftsmsResponse>('delete', `/contacts/${this.groupId}`);
  }

  /**
   * Access individual contacts within this group
   */
  public get contacts(): GroupContacts {
    if (!this._contacts) {
      this._contacts = createGroupContacts(this.client, this.groupId);
    }
    return this._contacts;
  }
}

// ─── Group Contacts (scoped to a groupId) ────────────────────────────────────

export interface GroupContacts {
  (uid: string): GroupContactContext;
  list(): Promise<SwiftsmsResponse<PaginatedData<ContactData>>>;
  create(payload: ContactPayload): Promise<SwiftsmsResponse<ContactData>>;
}

export function createGroupContacts(client: HttpClient, groupId: string): GroupContacts {
  const contactsFunc = function (uid: string) {
    return new GroupContactContext(client, groupId, uid);
  } as GroupContacts;

  /**
   * View all contacts in a group (POST /contacts/{group_id}/all)
   */
  contactsFunc.list = async function () {
    if (!groupId) throw new Error('Group ID cannot be empty');
    return client.request<SwiftsmsResponse<PaginatedData<ContactData>>>('post', `/contacts/${groupId}/all`);
  };

  /**
   * Create a contact in a group (POST /contacts/{group_id}/store)
   * @param payload - { PHONE, FIRST_NAME?, LAST_NAME?, ...customFields }
   */
  contactsFunc.create = async function (payload: ContactPayload) {
    if (!payload.PHONE) throw new Error('PHONE is required');
    return client.request<SwiftsmsResponse<ContactData>>('post', `/contacts/${groupId}/store`, payload);
  };

  return contactsFunc;
}

// ─── Group Contact Context (scoped to groupId + uid) ─────────────────────────

export class GroupContactContext {
  constructor(
    private client: HttpClient,
    private groupId: string,
    private uid: string
  ) {}

  /**
   * View a contact (POST /contacts/{group_id}/search/{uid})
   */
  public async fetch(): Promise<SwiftsmsResponse<ContactData>> {
    if (!this.groupId || !this.uid) throw new Error('Group ID and UID cannot be empty');
    return this.client.request<SwiftsmsResponse<ContactData>>('post', `/contacts/${this.groupId}/search/${this.uid}`);
  }

  /**
   * Update a contact (PATCH /contacts/{group_id}/update/{uid})
   * @param payload - { PHONE, FIRST_NAME?, LAST_NAME?, ...customFields }
   */
  public async update(payload: ContactPayload): Promise<SwiftsmsResponse<ContactData>> {
    if (!payload.PHONE) throw new Error('PHONE is required');
    return this.client.request<SwiftsmsResponse<ContactData>>('patch', `/contacts/${this.groupId}/update/${this.uid}`, payload);
  }

  /**
   * Delete a contact (DELETE /contacts/{group_id}/delete/{uid})
   */
  public async delete(): Promise<SwiftsmsResponse> {
    if (!this.groupId || !this.uid) throw new Error('Group ID and UID cannot be empty');
    return this.client.request<SwiftsmsResponse>('delete', `/contacts/${this.groupId}/delete/${this.uid}`);
  }
}
