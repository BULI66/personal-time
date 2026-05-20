const ENCRYPTION_KEY = 'calendar-encryption-key-256-bit';

async function getEncryptionKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(password + ENCRYPTION_KEY);
  const hash = await crypto.subtle.digest('SHA-256', keyMaterial);
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: unknown, password: string = 'default'): Promise<string | null> {
  try {
    const key = await getEncryptionKey(password);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );
    
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
}

export async function decryptData(encryptedData: string, password: string = 'default'): Promise<unknown> {
  try {
    const key = await getEncryptionKey(password);
    
    const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
    
    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedBuffer
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

export function isEncryptionSupported(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}

export async function encryptedLocalStorageSetItem(key: string, value: unknown, password: string = 'default'): Promise<boolean> {
  if (!isEncryptionSupported()) {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }
  
  const encrypted = await encryptData(value, password);
  if (encrypted) {
    localStorage.setItem(key, encrypted);
    return true;
  }
  return false;
}

export async function encryptedLocalStorageGetItem(key: string, password: string = 'default'): Promise<unknown> {
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  
  if (!isEncryptionSupported()) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  
  const decrypted = await decryptData(stored, password);
  if (decrypted !== null) {
    return decrypted;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
