const bcrypt = require('bcryptjs')
import { IsString, IsEmail, validateOrReject, IsPhoneNumber, IsBoolean } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

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
    @IsPhoneNumber()
    public phoneNumber: string

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    @IsString()
    public role: UserRole

    @Column({
        type: 'boolean',
        default: false,
    })
    @IsBoolean()
    public verified: boolean

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
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

}
