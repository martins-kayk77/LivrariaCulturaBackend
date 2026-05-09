import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const useSSL = process.env.DB_SSL === "true";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useSSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
  entities: ["src/entities/*.js"],
  migrations: ["src/database/migrations/*.cjs"],
});

export { AppDataSource };
