import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fishery_fisheryequipment')
export class FisheryFisheryEquipment {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    position!: string;

    @Column('timestamp')
    bind_time!: Date;

    @Column()
    type!: string;

    @Column()
    equipment_id!: string;

    @Column()
    owner_id!: number;

    @Column()
    pond_id!: number;
}