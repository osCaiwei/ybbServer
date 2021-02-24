import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('gather_data')
export class GatherData {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user!: string;

    @Column()
    type!: string;

    @Column('json')
    location!: [number, number];

    @Column('json')
    images: Array<string> = [];

    @Column()
    SN!: string;

    @Column()
    appid!: string;

    @Column()
    adcode!: string;

    @Column('timestamp')
    time!: Date;
}