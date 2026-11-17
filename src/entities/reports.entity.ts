import { Column, PrimaryColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, type Relation } from "typeorm";
import { Categories } from "./categories.entity.js";
import { Locations } from "./locations.entity.js";
import { PrivateContact } from "./privateContact.entity.js";
import { Claims } from "./claims.entity.js";

export enum LostAndFoundStatus {
  PENDING = 'pending',
  LOST = 'lost',
  FOUND = 'found',
}
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

    @Column({type: 'varchar', length: 255, nullable: true})
    photo_url_optional: string | null;

    @Column({type:"enum", enum:LostAndFoundStatus, default: LostAndFoundStatus.PENDING})
    status: LostAndFoundStatus;

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

    @OneToMany(() => Claims, (claims) => claims.report)
    claims: Relation<Claims[]>
}