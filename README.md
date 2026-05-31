# swiftsmsgh-api-sdk

![Node.js CI](https://github.com/supreme-majesty/swiftsmsgh-node/actions/workflows/ci.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/swiftsmsgh-api-sdk.svg)
![License](https://img.shields.io/npm/l/swiftsmsgh-api-sdk.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-enabled-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x%2B-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Issues Welcome](https://img.shields.io/badge/Issues-welcome-brightgreen.svg)

The Swiftsms-GH Node.js library provides a convenient way to interact with the Swiftsms-GH API from applications written in server-side JavaScript (Node.js). It includes a modular, resource-based class structure.

## Documentation
The documentation for the Swiftsms-GH API can be found [here](https://swiftsmsgh.com/developer).

## Supported Node.js Versions
* Node.js 18
* Node.js 20
* Node.js 22
* Node.js 24 (lts)

TypeScript is supported and type definitions are included natively.

> **Warning** Do not use this library in a front-end application. Doing so can expose your Swiftsms-GH API token to end-users as part of the bundled HTML/JavaScript sent to their browser.

## Installation
```bash
npm install swiftsmsgh-api-sdk
# or
yarn add swiftsmsgh-api-sdk
```

## Test your installation

```javascript
// Your API Token and Sender ID from swiftsmsgh.com
const client = require('swiftsmsgh-api-sdk')('YOUR_API_TOKEN', 'YOUR_SENDER_ID');

client.sms.send('233538000000', 'Hello from Swiftsms-GH Node SDK')
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

> **Warning** Use environment variables in production — never hardcode credentials.

---

## Environment Variables

```javascript
// Automatically uses SWIFTSMS_API_TOKEN and SWIFTSMS_SENDER_ID
const client = require('swiftsmsgh-api-sdk')();
```

---

## Enable Auto-Retry with Exponential Backoff

```javascript
const client = require('swiftsmsgh-api-sdk')(
  process.env.SWIFTSMS_API_TOKEN,
  process.env.SWIFTSMS_SENDER_ID,
  { autoRetry: true, maxRetries: 3 }
);
```

---

## Usage Examples

### Send SMS

```javascript
// Plain SMS (single recipient)
await client.sms.send('233538000000', 'Hello World');

// Multiple recipients (comma-separated string or array)
await client.sms.send(['233538000000', '233540000000'], 'Hello everyone');

// With options
await client.sms.send('233538000000', 'Scheduled message', {
  schedule_time: '2025-12-25 08:00',
  dlt_template_id: 'your-dlt-id',
  sender_id: 'MyBrand',            // Override default sender
});
```

### Send Campaign to Contact Lists

```javascript
// Send to a single contact list
await client.sms.sendCampaign('6415907d0d37a', 'Hello subscribers!');

// Send to multiple contact lists
await client.sms.sendCampaign(
  ['6415907d0d37a', '6415907d0d7a6'],
  'Hello everyone!',
  { schedule_time: '2025-12-25 08:00' }
);
```

### List All Messages

```javascript
// All messages
const messages = await client.sms.list();

// Filtered by date, type, direction, and timezone
const filtered = await client.sms.list({
  start_date: '2025-05-01 08:00:00',
  end_date: '2025-05-22 18:00:00',
  sms_type: 'plain',        // 'plain' | 'unicode' | 'voice' | 'mms' | 'whatsapp' | 'otp' | 'viber'
  direction: 'outgoing',   // 'outgoing' | 'incoming' | 'api'
  timezone: 'Africa/Accra',
});
```

### View a Single SMS / Campaign

```javascript
await client.sms.view('606812e63f78b');
await client.campaign.view('606812e63f78b');
```

### Voice, MMS, OTP, WhatsApp, Viber

```javascript
// Voice call
await client.voice.send('233538000000', 'Wake up!', 'female', 'en-gb');

// MMS with media
await client.mms.send('233538000000', 'Check this out', 'https://example.com/image.jpg');

// OTP
await client.otp.send('233538000000', 'Your code is 1234');

// WhatsApp (supports optional media_url)
await client.whatsapp.send('233538000000', 'Hello from WhatsApp', {
  media_url: 'https://example.com/image.jpg'
});

// Viber (supports optional media_url)
await client.viber.send('233538000000', 'Hello from Viber');
```

### Account Info

```javascript
const balance = await client.account.balance();
const profile = await client.account.profile();
```

---

## Contacts & Groups Management

### Contact Groups

```javascript
// List all groups
const groups = await client.contacts.groups.list();

// Create a group
const group = await client.contacts.groups.create('My Group Name');

// View a specific group
const myGroup = await client.contacts.groups('groupId').fetch();

// Update a group name
await client.contacts.groups('groupId').update('New Name');

// Delete a group
await client.contacts.groups('groupId').delete();
```

### Contacts within a Group

```javascript
const groupId = '6065ecdc9184a';

// List all contacts in a group
await client.contacts.groups(groupId).contacts.list();

// Create a contact in a group
await client.contacts.groups(groupId).contacts.create({
  PHONE: '233538000000',
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
});

// View a specific contact
await client.contacts.groups(groupId).contacts('uid123').fetch();

// Update a contact
await client.contacts.groups(groupId).contacts('uid123').update({
  PHONE: '233538000001',
  FIRST_NAME: 'Jane',
});

// Delete a contact
await client.contacts.groups(groupId).contacts('uid123').delete();
```

---

## TypeScript Usage

All interfaces are exported from the main package:

```typescript
import swiftsmsgh, {
  SwiftsmsException,
  SmsData,
  BalanceData,
  SmsListParams,
  ContactPayload,
} from 'swiftsmsgh-api-sdk';

const client = swiftsmsgh('YOUR_API_TOKEN', 'YOUR_SENDER_ID');

try {
  const response = await client.account.balance();
  console.log(response.data?.remaining_balance);
} catch (error) {
  if (error instanceof SwiftsmsException) {
    console.log(`API Error ${error.code}: ${error.message}`);
    console.log(`HTTP Status: ${error.status}`);
  }
}
```

---

## Debug API Requests

```javascript
client.sms.send('233538000000', 'Ahoy!')
  .then(() => {
    console.log(client.lastRequest.method);
    console.log(client.lastRequest.url);
    console.log(client.lastRequest.data);
    console.log(client.httpClient.lastResponse.status);
  });
```

---

## Status Codes

| Status | Message                                  |
| ------ | ---------------------------------------- |
| `ok`   | Successfully Sent                        |
| `100`  | Bad gateway requested                    |
| `101`  | Wrong action                             |
| `102`  | Authentication failed                    |
| `103`  | Invalid phone number                     |
| `104`  | Phone coverage not active                |
| `105`  | Insufficient balance                     |
| `106`  | Invalid Sender ID                        |
| `107`  | Invalid SMS Type                         |
| `108`  | SMS Gateway not active                   |
| `109`  | Invalid Schedule Time                    |
| `110`  | Media url required                       |
| `111`  | SMS contains spam word. Awaiting approval|

---

## License
MIT License
