import { IsNumber, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm"
import { Product } from "./Product"
import { Transaction } from "./Transaction"
import { User } from "./User"

@Entity()
export class TransactionDetail {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    @IsNumber()
    public quantity: number

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @ManyToOne(() => User, (user) => user.transaction_detail)
    public user: User

    @ManyToOne(() => Product, (product) => product.transaction_detail)
    public product: Product

    @ManyToOne(() => Transaction, (transaction) => transaction.transaction_detail)
    public transaction: Transaction
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
