import { isEnum, IsEnum, IsNumber, IsOptional, IsString, IsUppercase, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm"
import { TransactionDetail } from "./TransactionDetail"
import { User } from "./User"

export enum TransPayment {
    COD = 'COD',
    TRANSFER = 'TRANSFER',
}

export enum TransStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}
@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column({
        nullable: true,
        type: 'text'
    })
    @IsString()
    @IsOptional()
    public address: string

    @Column({
        type: 'enum',
        enum: TransPayment,
    })
    @IsString()
    @IsEnum(TransPayment)
    public payment: TransPayment

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
        type: 'enum',
        enum: TransStatus,
        default: TransStatus.PENDING
    })
    @IsString()
    @IsEnum(TransStatus)
    @IsOptional()
    public status: TransStatus

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
