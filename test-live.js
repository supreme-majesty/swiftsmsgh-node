/**
 * Live test script for swiftsmsgh-api-sdk
 * 
 * Usage:
 *   SWIFTSMS_API_TOKEN=your_token SWIFTSMS_SENDER_ID=your_sender node test-live.js
 */

// Import the SDK directly from the local build
require('dotenv').config();
const swiftsmsgh = require('./dist/index');

const API_TOKEN = process.env.SWIFTSMS_API_TOKEN || 'PASTE_YOUR_TOKEN_HERE';
const SENDER_ID = process.env.SWIFTSMS_SENDER_ID || 'PASTE_SENDER_ID';
const TEST_PHONE = process.env.TEST_PHONE || 'PASTE_PHONE_NUMBER';

const client = swiftsmsgh(API_TOKEN, SENDER_ID);

async function runTests() {
  console.log('=== Swiftsms-GH SDK Live Test ===\n');

  // 1. Check balance
  try {
    console.log('1. Checking account balance...');
    const balance = await client.account.balance();
    console.log('   ✅ Balance:', JSON.stringify(balance, null, 2));
  } catch (err) {
    console.log('   ❌ Balance error:', err.message);
  }

  // 2. View profile
  try {
    console.log('\n2. Fetching profile...');
    const profile = await client.account.profile();
    console.log('   ✅ Profile:', JSON.stringify(profile, null, 2));
  } catch (err) {
    console.log('   ❌ Profile error:', err.message);
  }

  // 3. Send a test SMS
  try {
    console.log(`\n3. Sending test SMS to ${TEST_PHONE}...`);
    const sms = await client.sms.send(TEST_PHONE, 'Hello from swiftsmsgh-api-sdk v1.0.0!');
    console.log('   ✅ SMS sent:', JSON.stringify(sms, null, 2));
  } catch (err) {
    console.log('   ❌ SMS error:', err.message);
  }

  // 4. List all messages
  try {
    console.log('\n4. Listing recent messages...');
    const messages = await client.sms.list();
    console.log('   ✅ Messages:', JSON.stringify(messages, null, 2));
  } catch (err) {
    console.log('   ❌ List error:', err.message);
  }

  // 5. List contact groups
  try {
    console.log('\n5. Listing contact groups...');
    const groups = await client.contacts.groups.list();
    console.log('   ✅ Groups:', JSON.stringify(groups, null, 2));
  } catch (err) {
    console.log('   ❌ Groups error:', err.message);
  }

  console.log('\n=== Test Complete ===');
}

runTests();
