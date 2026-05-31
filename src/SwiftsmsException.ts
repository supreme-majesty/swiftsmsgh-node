export class SwiftsmsException extends Error {
  public code?: number;
  public status?: number;
  public moreInfo?: string;

  constructor(message: string, code?: number, status?: number, moreInfo?: string) {
    super(message);
    this.name = 'SwiftsmsException';
    this.code = code;
    this.status = status;
    this.moreInfo = moreInfo;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SwiftsmsException.prototype);
  }
}
