import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reports } from "../entities/reports.entity.js";

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @OneToMany(() => Reports, (reports) => reports.categories)
    reports: Reports[];
}