import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";

export default registerAs("db", (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DEV === 'true' ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST,
    port: process.env.DEV === 'true' ? +process.env.DEV_DB_PORT! : +process.env.PROD_DB_PORT!,
    username: process.env.DEV === 'true' ? process.env.DEV_DB_USERNAME : process.env.PROD_DB_USERNAME,
    password: process.env.DEV === 'true' ? process.env.DEV_DB_PASSWORD : process.env.PROD_DB_PASSWORD,
    database: 'taskmanagement',
    entities: [User],
    synchronize: false,
}));