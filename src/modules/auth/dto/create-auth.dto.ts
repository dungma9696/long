import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  name: string;
}

export class CodeAuthDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: '1234', description: 'Activation code' })
  @IsNotEmpty()
  code: string;
}

export class ResendEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsNotEmpty()
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234', description: 'Reset code' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsNotEmpty()
  newPassword: string;
}
