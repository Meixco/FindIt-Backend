import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reports } from "./reports.entity.js";

@Entity()
export class PrivateContact {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne("Reports", (reports: Reports) => reports.privatecontact, {onDelete: "CASCADE"})
    @JoinColumn({name: "report_id"})
    reports: Reports;

    @Column()
    contact_name: string;

    @Column()
    contact_method: string;

    @Column()
    contact_value: string;
}