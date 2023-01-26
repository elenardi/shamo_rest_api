import { IsNumber, IsString, validateOrReject } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Category } from "./Category"
import { ProductGallery } from "./ProductGallery"
import { TransactionDetail } from "./TransactionDetail"

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

    @OneToMany(() => TransactionDetail, (transaction_detail) => transaction_detail.product)
    public transaction_detail: TransactionDetail

    @OneToMany(() => ProductGallery, (product_gallery) => product_gallery.product)
    public product_gallery: ProductGallery
    
    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}
