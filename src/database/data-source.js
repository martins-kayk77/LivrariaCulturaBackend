import "dotenv/config";
import "reflect-metadata";
import {DataSource} from "typeorm"

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entities/*.js"],
    migrations: ["src/database/migrations/*.cjs"]

});

export {AppDataSource}

