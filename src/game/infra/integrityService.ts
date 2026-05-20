// Lightweight HMAC-SHA256 signature over key result fields.
// The key is a bundle constant — not perfect security, but raises the bar
// for casual localStorage injection past "edit and save".
const HMAC_KEY = 'lab-lights-integrity-v1-k7x9q2p';

function keyBytes(): Uint8Array {
  return new TextEncoder().encode(HMAC_KEY);
}

async function importHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    keyBytes().buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function message(seed: string, score: number, moves: number): ArrayBuffer {
  return new TextEncoder().encode(`${seed}:${score}:${moves}`).buffer;
}

export async function signResult(seed: string, score: number, moves: number): Promise<string> {
  const key = await importHmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, message(seed, score, moves));
  return toBase64(sig);
}

export async function verifyResultSignature(
  seed: string,
  score: number,
  moves: number,
  hmac: string,
): Promise<boolean> {
  try {
    const key = await importHmacKey();
    return await crypto.subtle.verify('HMAC', key, fromBase64(hmac), message(seed, score, moves));
  } catch {
    return false;
  }
}
