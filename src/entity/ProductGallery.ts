import { IsString, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Product } from "./Product"

@Entity()
export class ProductGallery {
    static bulkCreate(productImages: any[]) {
        throw new Error("Method not implemented.")
    }
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    @IsString()
    public url: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @ManyToOne(() => Product, (product) => product.product_gallery, { onDelete: 'CASCADE' })
    @JoinColumn()
    public product: Product
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
