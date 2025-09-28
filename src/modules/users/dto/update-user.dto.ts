import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../enums/user-role.enum';
import { UserStatus } from '../../../enums/user-status.enum';

export class UpdateUserDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  @IsMongoId({ message: '_id khong ho le' })
  @IsNotEmpty({ message: '_id khong duoc de rong' })
  _id: string;

  @ApiProperty({
    example: 'John Doe Updated',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'User password',
    required: false,
  })
  @IsOptional()
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
