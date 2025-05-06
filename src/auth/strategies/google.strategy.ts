import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import googleOauthConfig from '../configs/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfig: ConfigType<typeof googleOauthConfig>,
        private authService: AuthService
    ) {
        super({
            clientID: googleConfig.clientID!,
            clientSecret: googleConfig.clientSecret!,
            callbackURL: 'http://localhost:3002/api/auth/google/callback',
            scope: ['profile', 'email'],
            passReqToCallback: true,
        });
    }
    
    async validate(req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const user = await this.authService.validateUserGoogle({
            email: profile.emails[0].value,
            name: profile.displayName,
            password: '',
        });
        return user;
    }
}