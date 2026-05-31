import { Swiftsmsgh } from '../src/Swiftsmsgh';

// We mock axios so we don't make real network requests during tests
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
      request: jest.fn().mockResolvedValue({
        data: {
          status: 'success',
          data: { uid: 'mock-uid', to: '233538000000', message: 'Mocked!', status: 'delivered' },
        },
      }),
    })),
  };
});

describe('Sms Resource', () => {
  let client: Swiftsmsgh;

  beforeEach(() => {
    client = new Swiftsmsgh('TEST_TOKEN', 'TEST_SENDER');
  });

  it('should format payload correctly when sending a single SMS', async () => {
    // We spy on the underlying axios request method to check its arguments
    const requestSpy = jest.spyOn(client.httpClient['axiosInstance'], 'request');

    await client.sms.send('233538000000', 'Hello Test', { schedule_time: '2025-01-01 10:00' });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/sms/send',
        data: {
          recipient: '233538000000',
          sender_id: 'TEST_SENDER',
          type: 'plain',
          message: 'Hello Test',
          schedule_time: '2025-01-01 10:00',
        },
      })
    );
  });
});
