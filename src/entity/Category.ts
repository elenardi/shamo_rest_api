import { IsString, IsUppercase, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { Product } from "./Product"

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    @IsString()
    @IsUppercase()
    public name: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @OneToMany(() => Product, (product) => product.category)
    public product: Product
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
