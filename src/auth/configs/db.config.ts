import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";

export default registerAs("db", (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'taskmanagement',
    entities: [User],
    synchronize: false,
}));