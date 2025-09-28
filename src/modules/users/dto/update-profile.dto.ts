import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe Updated',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'User address',
    required: false,
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob: string;

  @ApiProperty({
    example: 'Male',
    description: 'User gender',
    required: false,
  })
  @IsOptional()
  gender: string;

  @ApiProperty({
    example: 'premium',
    description: 'Account type',
    required: false,
  })
  @IsOptional()
  accountType: string;
}
