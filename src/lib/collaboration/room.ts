// Generates a 6-character human-friendly alphanumeric ID.
// Excludes confusing characters: O / 0, I / 1, S / 5, B / 8

const ALPHABET = 'ACDEFGHJKLMNPQRTUVWXYZ234679';

export function generateRoomId(): string {
  let id = '';
  const randomValues = new Uint8Array(6);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < 6; i++) {
    id += ALPHABET[randomValues[i] % ALPHABET.length];
  }
  
  return id;
}

export function isValidRoomId(id: string): boolean {
  if (id.length !== 6) return false;
  const regex = new RegExp(`^[${ALPHABET}]{6}$`);
  return regex.test(id);
}
