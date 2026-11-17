import {
  BadRequestException,
  Injectable,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { UPLOADED_IMAGE_PATH_REGEX, detectImageType } from '../utills/image.utills.js';

@Injectable()
export class UploadsService implements OnModuleInit {
  /** Folder fisik: <UPLOAD_DIR>/reports */
  private readonly dir: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.dir = resolve(
      process.cwd(), // ESM tidak punya __dirname, jalankan server dari root project
      config.get<string>('UPLOAD_DIR') ?? 'uploads',
      'reports',
    );
    const rawUrl = config.get<string>('BASE_URL') ?? config.get<string>('APP_URL');
    this.baseUrl = rawUrl?.replace(/\/$/, '') ?? 'http://localhost:3000';
  }

  async onModuleInit() {
    await mkdir(this.dir, { recursive: true });
  }

  async saveImage(file: { buffer: Buffer; size: number }) {
    const type = detectImageType(file.buffer);
    if (!type) {
      throw new BadRequestException(
        'File bukan gambar JPG, PNG, atau WebP yang valid',
      );
    }

    // Nama file dibuat server (UUID). Nama asli dari klien tidak dipakai sama sekali,
    // sehingga path traversal (../) dan ekstensi berbahaya tidak mungkin terjadi.
    const filename = `${randomUUID()}.${type.ext}`;
    await writeFile(join(this.dir, filename), file.buffer, { flag: 'wx' });

    const relativePath = `/uploads/reports/${filename}`
    return {
      path: `${this.baseUrl}${relativePath}`, // simpan nilai ini di kolom photo_url
      mime: type.mime,
      size: file.size,
    };
  }

  /** Hapus file, misalnya saat admin menghapus laporan. Aman dari path traversal. */
  async remove(path: string): Promise<boolean> {
    const cleanPath = path.startsWith('http') ? new URL(path).pathname : path;
    if (!UPLOADED_IMAGE_PATH_REGEX.test(cleanPath)) return false;
    try {
      await unlink(join(this.dir, basename(cleanPath)));
      return true;
    } catch (err: any) {
      if (err?.code === 'ENOENT') return false;
      throw err;
    }
  }
}