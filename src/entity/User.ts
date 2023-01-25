const bcrypt = require('bcryptjs')
import { IsString, IsEmail, validateOrReject, IsPhoneNumber, IsBoolean, IsNumber } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { Transaction } from "./Transaction"

export enum UserRole {
    CUSTOMER = 'customer',
    MERCHANT = 'merchant',
    ADMIN = 'admin',
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
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

}
