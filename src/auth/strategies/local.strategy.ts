import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<any> {
        if (password === '') {
            throw new UnauthorizedException('Password cannot be empty');
        }
        return await this.authService.validateUserLocal(email, password);
    }
}