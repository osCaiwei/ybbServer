import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userName!: string;

    @Column()
    phone!: string;

    @Column()
    address!: string;

    @Column()
    type!: string ;

    @Column()
    area!: number;

    @Column('json')
    controllerid!: Array<number>;

    @Column('json')
    cameraid!: Array<number>;

}