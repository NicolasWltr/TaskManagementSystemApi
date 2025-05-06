import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('register')
    async register(@Body() userToCreate: { name: string, email: string, password: string }) {
        const user = await this.usersService.create({
            name: userToCreate.name,
            email: userToCreate.email,
            password: userToCreate.password,
        });
        const { password, ...result } = user;
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
