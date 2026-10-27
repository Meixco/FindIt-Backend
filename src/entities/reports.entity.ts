import { Column, PrimaryColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Categories } from "../categories/categories.entity.js";
import { Locations } from "./locations.entity.js";

@Entity()
export class Reports {
    @PrimaryColumn({type: "varchar", length: 20})
    id: string;

    @Column()
    report_type: string;

    @Column()
    item_name: string;

    @Column({type: 'text'})
    description_public: string;

    @Column({type: 'date'})
    event_date: Date;

    @Column({nullable: true})
    event_time_optional: string;

    @Column({nullable: true})
    photo_url_optional: string;

    @Column({default: "PENDING"})
    status: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @ManyToOne(() => Categories, (categories) => categories.reports, {onDelete: "SET NULL"})
    @JoinColumn({name: 'category_id'})
    categories: Categories;

    @ManyToOne(() => Locations, (locations) => locations.reports, {onDelete: "SET NULL"})
    @JoinColumn({name: 'location_id'})
    locations: Locations;
}