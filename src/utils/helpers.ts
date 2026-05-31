export function formatPhone(phone: string | string[], code: string = '233'): string | string[] {
  if (Array.isArray(phone)) {
    return phone.map(p => p.replace(/^0/, code));
  }
  return phone.replace(/^0/, code);
}

export function validateMessagePayload(phones: string | string[], message: string): void {
  if (!phones || phones.length === 0) {
    throw new Error('Phones cannot be empty');
  }
  if (!message) {
    throw new Error('Message cannot be empty');
  }
}

