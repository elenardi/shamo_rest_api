const bcrypt = require('bcryptjs')
import { IsNumber, IsString, IsUppercase, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Category } from "./Category"

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    @IsString()
    public name: string

    @Column({
        type: 'float'
    })
    @IsNumber()
    public price: number

    @Column({
        type: 'longtext'
    })
    @IsString()
    public desc: string

    @Column()
    @IsString()
    public tags: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @ManyToOne(() => Category, (category) => category.product, { onDelete: 'CASCADE' })
    @JoinColumn()
    public category: Category
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
