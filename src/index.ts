import { Swiftsmsgh } from './Swiftsmsgh';
import { HttpClientOptions } from './HttpClient';
import { SwiftsmsException } from './SwiftsmsException';

// Re-export all interfaces so consumers can use them directly:
// import { BalanceData, SmsData, SmsListParams, ... } from 'swiftsmsgh-api-sdk'
export * from './interfaces';
export { Swiftsmsgh, SwiftsmsException };

export interface SwiftsmsghClientFactory {
  (apiToken?: string, senderId?: string, options?: HttpClientOptions): Swiftsmsgh;
  Swiftsmsgh: typeof Swiftsmsgh;
  SwiftsmsException: typeof SwiftsmsException;
}

const factory = function (apiToken?: string, senderId?: string, options?: HttpClientOptions): Swiftsmsgh {
  return new Swiftsmsgh(apiToken, senderId, options);
} as SwiftsmsghClientFactory;

factory.Swiftsmsgh = Swiftsmsgh;
factory.SwiftsmsException = SwiftsmsException;

export default factory;

// Support CommonJS: const client = require('swiftsmsgh-api-sdk')(token, senderId)
module.exports = factory;
module.exports.default = factory;
module.exports.Swiftsmsgh = Swiftsmsgh;
module.exports.SwiftsmsException = SwiftsmsException;
