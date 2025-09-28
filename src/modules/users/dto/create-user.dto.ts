import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../enums/user-role.enum';
import { UserStatus } from '../../../enums/user-status.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  password: string;

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
    example: UserRole.CLIENT,
    description: 'User role',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: UserStatus.ACTIVE,
    description: 'User status',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    example: 'premium',
    description: 'Account type',
    required: false,
  })
  @IsOptional()
  accountType: string;
}
