import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

/**
 * Hash password memakai scrypt bawaan Node.js (tanpa library tambahan,
 * jadi aman dari masalah modul native + ESM).
 * Parameter mengikuti rekomendasi OWASP: N=2^15, r=8, p=3.
 * Format tersimpan: scrypt$N$r$p$saltHex$hashHex
 */
const N = 32_768;
const R = 8;
const P = 3;
const KEY_LEN = 64;
const DUMMY_SALT = Buffer.alloc(16, 1);

function derive(
  password: string,
  salt: Buffer,
  keyLen: number,
  n: number,
  r: number,
  p: number,
): Promise<Buffer> {
  const options: ScryptOptions = { N: n, r, p, maxmem: 128 * n * r * 2 };
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLen, options, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, KEY_LEN, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

/**
 * Jika `stored` kosong (akun tidak ada), tetap menjalankan hashing palsu
 * agar waktu respons login sama dan keberadaan akun tidak bisa ditebak.
 */
export async function verifyPassword(
  password: string,
  stored?: string | null,
): Promise<boolean> {
  if (!stored) {
    await derive(password, DUMMY_SALT, KEY_LEN, N, R, P);
    return false;
  }

  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, saltHex, hashHex] = parts;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await derive(
    password,
    Buffer.from(saltHex, 'hex'),
    expected.length,
    Number(n),
    Number(r),
    Number(p),
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}