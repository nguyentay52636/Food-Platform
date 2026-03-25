import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Đăng ký tài khoản' })
    @ApiResponse({ status: 201, description: 'Đăng ký thành công.', type: RegisterResponseDto })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc username/email đã tồn tại.' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Đăng nhập hệ thống' })
    @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về access_token + thông tin user.', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Tài khoản hoặc mật khẩu không chính xác.' })
    @ApiResponse({ status: 403, description: 'Tài khoản đã bị khóa (inactive).' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }
}

