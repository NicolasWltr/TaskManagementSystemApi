import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/entities/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUserLocal(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async validateUserJWT(userID: number): Promise<any> {
        const user = await this.usersService.findOne(userID);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id };
    }

    async validateUserGoogle(googleUser: CreateUserDto): Promise<any> {
        const user = await this.usersService.findByEmail(googleUser.email);
        if (user) return user;
        return this.usersService.create(googleUser);
    }
    
    async login(userID: any) {
        const user = await this.usersService.findOne(userID);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const payload = { name: user.name, sub: user.id, role: user.role, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
            }
        }
    }

    async googleCallBack(@Req() req, @Res() res) {
        const response = await this.login(req.user.id);

        res.cookie('jwt', response.access_token, {
            httpOnly: true,
            secure: process.env.DEV === 'false',
            domain: process.env.DEV === 'false' ? '.walternicolas.de' : undefined,
            sameSite: 'strict',
            maxAge: 3600 * 2000, // 1 week
        });

        res.send(`
            <script>
                window.close();
            </script>
        `);
    }
}
// login() {
//     const popup = window.open(
//         'http://localhost:3002/api/auth/google/login',
//         'GoogleAuth',
//         'width=500,height=600,menubar=no,toolbar=no'
//     );
// }