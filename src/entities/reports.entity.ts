import { Column, PrimaryColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, type Relation } from "typeorm";
import { Categories } from "../categories/categories.entity.js";
import { Locations } from "./locations.entity.js";
import { PrivateContact } from "./privateContact.entity.js";

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

    @ManyToOne(() => Categories, (categories) => categories.reports, {onDelete: "CASCADE"})
    @JoinColumn({name: 'category_id'})
    categories: Relation<Categories>;

    @ManyToOne(() => Locations, (locations) => locations.reports, {onDelete: "CASCADE"})
    @JoinColumn({name: 'location_id'})
    locations: Relation<Locations>;

    @OneToMany(() => PrivateContact, (priavatecontact) => priavatecontact.reports)
    privatecontact: Relation<PrivateContact>[];
}