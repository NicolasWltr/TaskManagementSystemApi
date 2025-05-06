import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUser: CreateUserDto): Promise<User> {
        const existingUser = await this.findByEmail(createUser.email);
        if (existingUser) {
            throw new ConflictException('email already used');
        }
        
        const user = new User();
        user.name = createUser.name;
        user.email = createUser.email;
        user.password = createUser.password;
        
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string):  Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    async findOne(id: number): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { id } });
    }
}