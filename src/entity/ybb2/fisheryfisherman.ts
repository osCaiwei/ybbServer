import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fishery_fisherman')
export class FisheryFisherman {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    area_code!: string;

    @Column()
    user_id!: number;
}