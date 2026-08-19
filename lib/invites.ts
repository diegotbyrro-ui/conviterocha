import { randomBytes } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function normalizeInviteCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (compact.startsWith('RCH') && compact.length === 19) {
    const body = compact.slice(3);
    return `RCH-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}`;
  }

  return value.trim().toUpperCase();
}

export function generateInviteCode() {
  const bytes = randomBytes(16);
  let body = '';

  for (const byte of bytes) {
    body += ALPHABET[byte & 31];
  }

  return `RCH-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}`;
}

export function slugifyBrokerage(value: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

  return slug || 'imobiliaria';
}