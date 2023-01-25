import { IsNumber, IsString, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm"
import { TransactionDetail } from "./TransactionDetail"
import { User } from "./User"

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column({
        type: 'text'
    })
    @IsString()
    public address: string

    @Column({
        default: 'MANUAL'
    })
    @IsString()
    public payment: string

    @Column({
        type: 'float'
    })
    @IsNumber()
    public totalPrice: number

    @Column({
        type: 'float'
    })
    @IsNumber()
    public sheppingPrice: number

    @Column({
        default: 'PENDING'
    })
    @IsString()
    public status: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @ManyToOne(() => User, (user) => user.transaction)
    public user: User

    @OneToMany(() => TransactionDetail, (transaction_detail) => transaction_detail.transaction)
    public transaction_detail: TransactionDetail
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
