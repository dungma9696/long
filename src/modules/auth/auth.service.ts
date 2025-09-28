import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswordHelper } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import {
  CodeAuthDto,
  CreateAuthDto,
  ResendEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
} from './dto/create-auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await comparePasswordHelper(password, user.password);

    if (!isMatch) {
      return null;
    }
    return user;
  }

  login(user: UserDocument) {
    // const { password: _password, ...payload } = user;

    const payload = { email: user.email, _id: user._id };
    const rawUser = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = rawUser;

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');
    const crsToken = randomBytes(32).toString('hex');

    // const timeExpiresAt = 30 * 24 * 60 * 60 * 1000;

    // const refreshTokenCacheData = {
    //   userId: user._id,
    //   expiresAt: Date.now() + timeExpiresAt,
    // };

    // await this.cacheManager.set(
    //   `refresh_token:${refreshToken}`,
    //   refreshTokenCacheData,
    //   timeExpiresAt,
    // );

    return { user: rawUser, accessToken, refreshToken, crsToken };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  resendEmail = async (resendEmailDto: ResendEmailDto) => {
    return await this.usersService.resendEmail(resendEmailDto.email);
  };

  changePassword = async (
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ) => {
    return await this.usersService.changePassword(userId, changePasswordDto);
  };

  forgotPassword = async (forgotPasswordDto: ForgotPasswordDto) => {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  };

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email khong ton tai');
    }

    const isMatch = await comparePasswordHelper(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Mat khau khong dung');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...payload } = user.toObject();

    return { ...payload, access_token: this.jwtService.sign(payload) };
  }
}
