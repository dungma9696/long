import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { ApiResponseData } from 'src/common/bases/api-response';
import { BannersService } from './banners.service';

@ApiTags('Public - Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get active banners' })
  async findActive() {
    const result = await this.bannersService.findActive();
    return ApiResponseData.ok(result);
  }
}
