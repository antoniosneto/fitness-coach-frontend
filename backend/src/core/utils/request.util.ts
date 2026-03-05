import { Request } from 'express';

/**
 * Extrai o IP do cliente a partir do request (proxy-safe).
 * Usado em rate limiting / força bruta (REQ-AUTH-002).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    const first = String(forwarded[0]).split(',')[0]?.trim();
    if (first) return first;
  }
  return req.socket?.remoteAddress ?? '127.0.0.1';
}
