const bcrypt = require('bcryptjs')
import { IsString, IsEmail, validateOrReject, IsPhoneNumber, IsBoolean, IsNumber, IsUppercase } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { Transaction } from "./Transaction"
import { TransactionDetail } from "./TransactionDetail"

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    MERCHANT = 'MERCHANT',
    ADMIN = 'ADMIN',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    @IsString()
    public fullname: string

    @Column()
    @IsString()
    public username: string

    @Column({
        unique: true
    })
    @IsEmail()
    public email: string

    @Column()
    @IsString()
    public password: string

    @Column()
    @IsString()
    public phoneNumber: string

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    @IsString()
    @IsUppercase()
    public role: UserRole

    @Column({
        type: 'int'
    })
    @IsNumber()
    public verifyCode: number

    @Column({
        type: 'boolean',
        default: false,
    })
    @IsBoolean()
    public isVerified: boolean

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    public checkIfPasswordMatch(unencryptedPassword: string): boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    public transaction: Transaction

    @OneToMany(() => TransactionDetail, (transaction_detail) => transaction_detail.user)
    public transaction_detail: TransactionDetail
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

}
