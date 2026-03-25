import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
    constructor(
        private readonly jwt: NestJwtService,
        private readonly config: ConfigService,
    ) { }

    signAccessToken(payload: any) {
        return this.jwt.sign(payload, {
            secret: this.config.get<string>('JWT_SECRET'),
            expiresIn: (this.config.get<string>('JWT_EXPIRES') || '1d') as any,
        });
    }

    signRefreshToken(payload: any) {
        return this.jwt.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret',
            expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d') as any,
        });
    }

    verifyToken(token: string) {
        return this.jwt.verify(token, {
            secret: this.config.get<string>('JWT_SECRET'),
        });
    }

    decode(token: string) {
        return this.jwt.decode(token);
    }
}