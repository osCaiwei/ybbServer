import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('expo_agri_product_price')
export class ExpoAgriProductPrice {
    @PrimaryGeneratedColumn()
    rid!: number;

    @Column({nullable: true,type:'date'})
    recordtime!: Date;

    @Column({nullable: true,type:'timestamp'})
    report_date!: Date;

    @Column({nullable: true,type:'text'})
    fluctuate_cause!: string;

    @Column({nullable: true , type: 'text'})
    auditor!: string

    @Column({nullable: true})
    price_avg!: number

    @Column({nullable: true})
    snatch_flag!:string

    @Column({nullable:true})
    audit_prog!:string

    @Column({nullable:true})
    business_unit!:number

    @Column({nullable:true})
    uuid!: string

    @Column({nullable:true})
    is_point_market!: string

    @Column({nullable:true})
    unit_code!:string

    @Column({nullable:true,type:'timestamp'})
    audit_date!: Date

    @Column({nullable:true})
    price_min!: number

    @Column({nullable:true})
    farm_prod_name!:string

    @Column({nullable:true})
    prod_addr!:string

    @Column({nullable:true})
    reporter!:string

    @Column({nullable:true})
    price_max!:number

    @Column({nullable:true})
    farm_prod_code!:string

    @Column({nullable:true})
    report_flag!:string

    @Column({nullable:true})
    market_code!:string

    @Column({nullable:true,type:'timestamp' })
    snatch_date!:Date

    @Column({nullable:true})
    sell_addr!:string

    @Column({nullable:true})
    market_uuid!:string

    @Column({nullable:true})
    market_name!:string

}