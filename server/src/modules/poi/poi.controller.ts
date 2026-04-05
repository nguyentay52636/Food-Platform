import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PoiService } from './poi.service';
import { CreatePoiDto } from './dto/create-poi.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { ResponsePoiDto } from './dto/response-poi.dto';

@ApiTags('poi')
@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new POI' })
  @ApiResponse({ status: 201, description: 'POI successfully created', type: ResponsePoiDto })
  async create(@Body() createPoiDto: CreatePoiDto) {
    return this.poiService.create(createPoiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all POIs' })
  @ApiResponse({ status: 200, description: 'Returns all POIs', type: [ResponsePoiDto] })
  async findAll() {
    return this.poiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a POI by ID' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiResponse({ status: 200, type: ResponsePoiDto })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async findOne(@Param('id') id: string) {
    return this.poiService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a POI' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiResponse({ status: 200, type: ResponsePoiDto })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async update(@Param('id') id: string, @Body() updatePoiDto: UpdatePoiDto) {
    return this.poiService.update(id, updatePoiDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a POI' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiResponse({ status: 200, type: ResponsePoiDto })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async remove(@Param('id') id: string) {
    return this.poiService.remove(id);
  }
}
