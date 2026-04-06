import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePoiDto } from './create-poi.dto';

/** Không cập nhật translations qua PATCH — dùng API /poi-translations */
export class UpdatePoiDto extends PartialType(
  OmitType(CreatePoiDto, ['translations'] as const),
) {}
