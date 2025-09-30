import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PricingDto {
  @ApiProperty({ description: 'Regular seat price' })
  @IsNumber()
  @Min(0)
  regular: number;

  @ApiProperty({ description: 'VIP seat price' })
  @IsNumber()
  @Min(0)
  vip: number;

  @ApiProperty({ description: 'Couple seat price' })
  @IsNumber()
  @Min(0)
  couple: number;
}
