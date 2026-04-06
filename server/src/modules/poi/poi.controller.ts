import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PoiService } from './poi.service';
import { CreatePoiDto } from './dto/create-poi.dto';
import { PatchPoiTranslationDto } from './dto/patch-poi-translation.dto';
import { PoiContentResponseDto } from './dto/poi-content-response.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';

@ApiTags('poi')
@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new POI' })
  @ApiQuery({ name: 'maNgonNgu', required: false, description: 'Language ID for response' })
  @ApiResponse({ status: 201, description: 'POI successfully created', type: PoiContentResponseDto })
  async create(
    @Body() createPoiDto: CreatePoiDto,
    @Query('maNgonNgu') maNgonNgu?: string,
  ) {
    return this.poiService.create(createPoiDto, maNgonNgu);
  }

  @Get()
  @ApiOperation({ summary: 'Get all POIs' })
  @ApiQuery({ name: 'maNgonNgu', required: false, description: 'Language ID for response' })
  @ApiResponse({ status: 200, description: 'Returns all POIs', type: [PoiContentResponseDto] })
  async findAll(@Query('maNgonNgu') maNgonNgu?: string) {
    return this.poiService.findAll(maNgonNgu);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a POI by ID' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiQuery({ name: 'maNgonNgu', required: false, description: 'Language ID for response' })
  @ApiResponse({ status: 200, type: PoiContentResponseDto })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async findOne(
    @Param('id') id: string,
    @Query('maNgonNgu') maNgonNgu?: string,
  ) {
    return this.poiService.findOne(id, maNgonNgu);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get POI content by selected language' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiQuery({ name: 'maNgonNgu', required: true, description: 'Language ID' })
  @ApiResponse({
    status: 200,
    description: 'POI content in requested language',
    type: PoiContentResponseDto,
  })
  async findContentByLanguage(
    @Param('id') id: string,
    @Query('maNgonNgu') maNgonNgu: string,
  ) {
    return this.poiService.findContentByLanguage(id, maNgonNgu);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a POI' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiQuery({ name: 'maNgonNgu', required: false, description: 'Language ID for response' })
  @ApiResponse({ status: 200, type: PoiContentResponseDto })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePoiDto: UpdatePoiDto,
    @Query('maNgonNgu') maNgonNgu?: string,
  ) {
    return this.poiService.update(id, updatePoiDto, maNgonNgu);
  }

  @Patch(':id/translations')
  @ApiOperation({ summary: 'Add or update a translation/audio for POI' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiResponse({ status: 200, type: PoiContentResponseDto })
  async patchTranslation(
    @Param('id') id: string,
    @Body() dto: PatchPoiTranslationDto,
  ) {
    return this.poiService.patchTranslation(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a POI' })
  @ApiParam({ name: 'id', description: 'POI unique ID' })
  @ApiResponse({ status: 200, description: 'POI deleted' })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async remove(@Param('id') id: string) {
    return this.poiService.remove(id);
  }
}
