import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '..//utills/password.utills.js';
import { AdminRole, Admins } from '../entities/admin.entity.js';
import { CreateAdminDto } from '../dto/admin.dto.js';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admins) private readonly repo: Repository<Admins>,
    private readonly config: ConfigService,
  ) {}

  /**
   * Admin pertama (super admin) dibuat dari .env, hanya jika tabel masih kosong.
   * Setelah itu hapus ADMIN_SEED_PASSWORD dari .env.
   */
  async onModuleInit() {
    const username = this.config.get<string>('ADMIN_SEED_USERNAME');
    const password = this.config.get<string>('ADMIN_SEED_PASSWORD');
    if (!username || !password) return;
    if ((await this.repo.count()) > 0) return;

    await this.create({
      username_or_email: username,
      password,
      role: AdminRole.SUPER_ADMIN,
    });
    this.logger.warn(
      'Super admin pertama dibuat dari ADMIN_SEED_*. Hapus ADMIN_SEED_PASSWORD dari .env sekarang.',
    );
  }

  async create(dto: CreateAdminDto) {
    if (dto.password.length < 12) {
      throw new BadRequestException('Password minimal 12 karakter');
    }
    const username = dto.username_or_email.trim().toLowerCase();

    if ((await this.repo.countBy({ username_or_email: username })) > 0) {
      throw new ConflictException('Akun sudah terdaftar');
    }

    try {
      const admin = await this.repo.save(
        this.repo.create({
          username_or_email: username,
          auth_reference: await hashPassword(dto.password),
          role: dto.role ?? AdminRole.ADMIN,
        }),
      );
      // Jangan pernah mengembalikan auth_reference.
      return {
        id: admin.id,
        username_or_email: admin.username_or_email,
        role: admin.role,
        created_at: admin.created_at,
      };
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY' || err?.code === '23505') {
        throw new ConflictException('Akun sudah terdaftar');
      }
      throw err;
    }
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  /** Satu-satunya query yang mengambil auth_reference (hash password). */
  findForLogin(identifier: string) {
    return this.repo
      .createQueryBuilder('a')
      .addSelect('a.auth_reference')
      .where('a.username_or_email = :u', { u: identifier.trim().toLowerCase() })
      .getOne();
  }

  async deactivate(id: number, actingAdminId: number) {
    if (id === actingAdminId) {
      throw new BadRequestException('Tidak bisa menonaktifkan akun sendiri');
    }
    const admin = await this.repo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin tidak ditemukan');

    admin.is_active = false;
    await this.repo.save(admin);
    return { id: admin.id, is_active: false };
  }
}