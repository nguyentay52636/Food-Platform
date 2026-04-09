import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RouterService } from './router.service';
import { CreateRouterDto } from './dto/create-router.dto';

@ApiTags('router')
@Controller('router')
export class RouterController {
    constructor(private readonly routerService: RouterService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo một Router mới kèm danh sách POIs' })
    @ApiResponse({ status: 201, description: 'Tạo Router thành công' })
    async create(@Body() createRouterDto: CreateRouterDto) {
        return this.routerService.create(createRouterDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy tất cả các Router' })
    @ApiResponse({ status: 200, description: 'Danh sách các Router' })
    async findAll() {
        return this.routerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy chi tiết một Router' })
    @ApiResponse({ status: 200, description: 'Thông tin chi tiết Router' })
    async findOne(@Param('id') id: string) {
        return this.routerService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa một Router' })
    @ApiResponse({ status: 200, description: 'Xóa Router thành công' })
    async remove(@Param('id') id: string) {
        return this.routerService.remove(id);
    }
}
