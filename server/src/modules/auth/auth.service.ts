import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '../../common/services/jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userServices: UserService,
        private readonly jwtService: JwtService,
    ) {}
}
