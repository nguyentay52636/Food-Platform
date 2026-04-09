import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    // REGISTER
    async register(dto) {
        const existEmail = await this.userService.findByEmail(dto.email);
        if (existEmail) throw new BadRequestException('Email exists');

        const existUser = await this.userService.findByEmailOrUsername(dto.username);
        if (existUser) throw new BadRequestException('Username exists');

        const hash = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create({
            ...dto,
            password: hash,
        });

        return this.generateToken(user);
    }

    // LOGIN
    async login(dto) {
        const user = await this.userService.findByEmailOrUsername(dto.account);
        if (!user) throw new UnauthorizedException('Invalid account');



        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new UnauthorizedException('Wrong password');

        return this.generateToken(user);
    }

    // JWT
    generateToken(user) {
        const payload = {
            sub: user._id,
            username: user.username,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    async validateUser(payload) {
        return this.userService.findById(payload.sub);
    }
}