import { IsNumber, IsString, IsUppercase, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm"
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

    @Column()
    @IsNumber()
    public totalPrice: number

    @Column()
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
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
