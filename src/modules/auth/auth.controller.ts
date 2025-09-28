import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/decorator/customize';
import {
  CodeAuthDto,
  CreateAuthDto,
  ResendEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  @ApiOperation({ summary: 'Verify activation code' })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('resend-email')
  @Public()
  @ApiOperation({ summary: 'Resend activation email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  resendEmail(@Body() resendEmailDto: ResendEmailDto) {
    return this.authService.resendEmail(resendEmailDto);
  }

  @Put('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user._id, changePasswordDto);
  }

  // @Post('forgot-password')
  // @Public()
  // @ApiOperation({ summary: 'Forgot password' })
  // @ApiResponse({ status: 200, description: 'Password reset email sent' })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(forgotPasswordDto);
  // }

  // @Get('email')
  // @Public()
  // @ApiOperation({ summary: 'Test email functionality' })
  // @ApiResponse({ status: 200, description: 'Email sent successfully' })
  // testMail() {
  //   this.mailerService
  //     .sendMail({
  //       to: 'dungma9696@gmail.com', // list of receivers
  //       subject: 'Testing Nest MailerModule ✔', // Subject line
  //       text: 'welcome', // plaintext body
  //       // html: '<b>welcome</b>', // HTML body content
  //       template: 'register',
  //       context: {
  //         name: 'dungma',
  //         activationCode: 1234,
  //       },
  //     })
  //     .then(() => {
  //       console.log('=====ok===');
  //     })
  //     .catch((err) => {
  //       console.log('====err===', err);
  //     });

  //   return 'ok';
  // }
}
