import "reflect-metadata"
import { DataSource } from "typeorm"
require('dotenv').config()

let dbConfig

if (process.env.NODE_ENV === 'production') {
    dbConfig = new DataSource({
        type: "mysql",
        socketPath: process.env.DB_SOCKET,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: ['./src/entity/*.ts'],
        migrations: ['./src/migration/*.ts'],
        subscribers: [],
    })
} else {
    dbConfig = new DataSource({
        type: "mysql",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: ['./src/entity/*.ts'],
        migrations: ['./src/migration/*.ts'],
        subscribers: [],
    })
}

export const AppDataSource = dbConfig
