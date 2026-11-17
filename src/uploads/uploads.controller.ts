import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { MAX_IMAGE_BYTES } from '../utills/image.utills.js';
import { UploadsService } from './uploads.service.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('uploads')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  /**
   * PUBLIK (pelapor tidak login), jadi dibatasi ketat:
   * 10 upload/menit per IP, maksimal 5 MB, 1 file, hanya JPG/PNG/WebP.
   * Form-data: key "file" bertipe File.
   */
  @Post('images')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_IMAGE_BYTES, files: 1 }, // melebihi batas -> 413
      fileFilter: (_req, file, cb) => {
        // Pemeriksaan awal saja. Pemeriksaan sebenarnya (magic bytes) ada di service.
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(new BadRequestException('Hanya JPG, PNG, atau WebP'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan (gunakan key "file")');
    }
    return this.service.saveImage(file);
  }
}
