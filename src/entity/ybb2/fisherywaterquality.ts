import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fishery_waterquality')
export class FisheryWaterQuality {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    dissolved_oxygen!: number;

    @Column()
    ph!: number;

    @Column()
    temperature!: number;

    @Column('timestamp')
    time!: Date;

    @Column('timestamp')
    etime!: Date;

    @Column()
    equipment_id!: string;
}