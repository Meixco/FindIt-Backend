import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Reports } from "./reports.entity.js";

@Entity()
export class Locations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    campus: string;

    @Column()
    buliding: string;

    @Column()
    area_name: string;
    
    @OneToMany(() => Reports, (reports) => reports.locations)
    reports: Reports[];
}