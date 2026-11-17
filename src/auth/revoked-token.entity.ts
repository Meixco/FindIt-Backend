import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

/**
 * Token yang sudah di-logout. JWT bersifat stateless, jadi logout dicatat
 * di sini dan dicek oleh guard di setiap request.
 * Baris dibersihkan otomatis setelah token aslinya kedaluwarsa.
 */
@Entity('revoked_tokens')
export class RevokedToken {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  jti: string;

  @Index()
  @Column()
  expires_at: Date;
}