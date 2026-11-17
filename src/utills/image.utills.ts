import { BadRequestException } from '@nestjs/common';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Pola path gambar hasil upload. Pakai di DTO laporan agar photo_url
 * hanya boleh berisi file yang diupload lewat aplikasi ini (bukan URL luar).
 *   @Matches(UPLOADED_IMAGE_PATH_REGEX) photo_url?: string;
 */
export const UPLOADED_IMAGE_PATH_REGEX =
  /^\/uploads\/reports\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export interface DetectedImage {
  ext: 'jpg' | 'png' | 'webp';
  mime: string;
}

/**
 * Mengenali jenis gambar dari isi file (magic bytes), BUKAN dari nama file
 * atau Content-Type kiriman klien, karena keduanya mudah dipalsukan.
 */
export function detectImageType(buf: Buffer): DetectedImage | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return { ext: 'png', mime: 'image/png' };
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }
  return null;
  
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

export const IMAGE_UPLOAD_OPTIONS = {
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (
    _req: unknown,
    file: { mimetype: string },
    cb: (error: Error | null, accept: boolean) => void,
  ) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new BadRequestException('Hanya JPG, PNG, atau WebP'), false);
    }
    cb(null, true);
  },
};