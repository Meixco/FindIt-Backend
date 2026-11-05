import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation,} from "typeorm";
import { Reports } from "./reports.entity.js";

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Claims {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Reports, (reports) => reports.claims)
    @JoinColumn({name: "report_id"})
    report: Relation<Reports>;

    @Column()
    claimant_name: string;

    @Column({nullable: true})
    student_number_optional: string;

    @Column()
    contact_private: string;

    @Column()
    claim_details_private: string;

    @Column({type:"enum", enum:ClaimStatus, default:ClaimStatus.PENDING})
    status: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @CreateDateColumn({name: "reviewed_at"})
    reviewedAt: Date;
}