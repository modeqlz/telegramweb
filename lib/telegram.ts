import { createHmac, timingSafeEqual } from 'crypto';

export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export function isValidTelegramInitData(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) return false;
    
    urlParams.delete('hash');
    
    // Sort parameters and create data check string
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Create secret key
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // Create HMAC
    const hmac = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    // Compare with timing-safe equal
    const hashBuffer = Buffer.from(hash, 'hex');
    const hmacBuffer = Buffer.from(hmac, 'hex');
    
    return hashBuffer.length === hmacBuffer.length && timingSafeEqual(hashBuffer, hmacBuffer);
  } catch (error) {
    console.error('Telegram validation error:', error);
    return false;
  }
}

export function getUserFromInitData(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get('user');
    
    if (!userParam) return null;
    
    const user = JSON.parse(decodeURIComponent(userParam));
    
    return {
      id: user.id?.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      language_code: user.language_code
    };
  } catch (error) {
    console.error('Parse user error:', error);
    return null;
  }
}
