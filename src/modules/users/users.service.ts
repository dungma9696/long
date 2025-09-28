import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserByIdDto } from './dto/update-user-by-id.dto';
import {
  FindAllUsersDto,
  SortField,
  SortOrder,
} from './dto/find-all-users.dto';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper, comparePasswordHelper } from 'src/helpers/util';
import {
  CodeAuthDto,
  CreateAuthDto,
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });

    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const {
      name,
      email,
      password,
      phone,
      address,
      dob,
      gender,
      accountType = 'EMAIL',
      role = 'CLIENT',
      status = 'ACTIVE',
    } = createUserDto;

    const isExist = await this.isEmailExist(email);

    if (isExist) {
      throw new BadRequestException(`Email da ton tai: ${email}`);
    }

    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      dob,
      gender,
      accountType,
      role,
      status,
    });
    return { _id: user._id };
  }

  async findAll(query: FindAllUsersDto) {
    const {
      current = '1',
      pageSize = '10',
      status,
      sortField = SortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
      search,
    } = query;

    // Convert string parameters to numbers
    const currentPage = parseInt(current, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    // Build filter object
    const filter: Record<string, any> = {};

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortField] = sortOrder === SortOrder.ASC ? 1 : -1;

    // Calculate pagination
    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSizeNum);
    const skip = (currentPage - 1) * pageSizeNum;

    // Execute query
    const results = await this.userModel
      .find(filter)
      .limit(pageSizeNum)
      .skip(skip)
      .select('-password')
      .sort(sort);

    return {
      results,
      totalItems,
      totalPages,
      current: currentPage,
      pageSize: pageSizeNum,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new BadRequestException(`Khong tim thay user`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const {
      _id,
      name,
      email,
      password,
      phone,
      address,
      dob,
      gender,
      role,
      status,
      accountType,
    } = updateUserDto;

    // Tạo object update chỉ chứa các trường được cung cấp
    const updateData: Partial<User> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (dob !== undefined) updateData.dob = new Date(dob);
    if (gender !== undefined) updateData.gender = gender;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (accountType !== undefined) updateData.accountType = accountType;

    // Xử lý password riêng để hash
    if (password !== undefined) {
      updateData.password = await hashPasswordHelper(password);
    }

    const user = await this.userModel
      .findByIdAndUpdate(_id, updateData, { new: true })
      .select('-password');

    if (user) {
      return user;
    }
    throw new BadRequestException(`Khong tim thay user`);
  }

  async updateById(id: string, updateUserByIdDto: UpdateUserByIdDto) {
    const {
      name,
      password,
      phone,
      address,
      dob,
      gender,
      role,
      status,
      accountType,
    } = updateUserByIdDto;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID khong hop le`);
    }

    // Tạo object update chỉ chứa các trường được cung cấp
    const updateData: Partial<User> = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (dob !== undefined) updateData.dob = new Date(dob);
    if (gender !== undefined) updateData.gender = gender;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (accountType !== undefined) updateData.accountType = accountType;

    // Xử lý password riêng để hash
    if (password !== undefined) {
      updateData.password = await hashPasswordHelper(password);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');

    if (user) {
      return user;
    }
    throw new BadRequestException(`Khong tim thay user`);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { name, phone, address, dob, gender, accountType } = updateProfileDto;

    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          name,
          phone,
          address,
          dob,
          gender,
          accountType,
        },
        { new: true },
      )
      .select('-password');

    if (!user) {
      throw new BadRequestException(`Khong tim thay user`);
    }

    return user;
  }

  async remove(_id: string) {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      const user = await this.userModel.findByIdAndDelete(_id);
      if (user) {
        return { _id: user._id };
      }
      throw new BadRequestException(`Khong tim thay user`);
    }
    throw new BadRequestException(`_id khong hop le`);
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const {
      name,
      email,
      password,
      // accountType = 'EMAIL',
      // role = 'USER',
    } = registerDto;

    const isExist = await this.isEmailExist(email);

    if (isExist) {
      throw new BadRequestException(`Email da ton tai: ${email}`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(1, 'minutes'),
    });

    await this.mailerService
      .sendMail({
        to: email, // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        template: 'register',
        context: {
          name: name,
          activationCode: codeId,
        },
      })
      .then(() => {
        console.log('=====ok===');
      })
      .catch((err) => {
        console.log('====err===', err);
      });

    return { _id: user._id };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data.id,
      codeId: data.code,
    });

    if (!user) {
      throw new BadRequestException('Ma code khong ho le');
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //
      await this.userModel.updateOne({ _id: data.id }, { isActive: true });

      return { isBeforeCheck };
    } else {
      throw new BadRequestException(' ma code het han');
    }
  }

  async resendEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException(`Email khong ton tai: ${email}`);
    }

    // if (user.status === 'ACTIVE') {
    //   throw new BadRequestException('Tai khoan da duoc kich hoat');
    // }

    // Tạo mã UUID mới và cập nhật thời gian hết hạn
    const newCodeId = uuidv4();
    const newCodeExpired = dayjs().add(1, 'minutes');

    await this.userModel.updateOne(
      { email },
      {
        codeId: newCodeId,
        codeExpired: newCodeExpired,
      },
    );

    // Gửi email với mã mới
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Mã kích hoạt mới - Smart Learn',
        template: 'register',
        context: {
          name: user.name,
          activationCode: newCodeId,
        },
      })
      .then(() => {
        console.log(`Email resend thành công cho: ${email}`);
      })
      .catch((err) => {
        console.log('Lỗi gửi email:', err);
        throw new BadRequestException('Lỗi gửi email');
      });

    return {
      message: 'Email đã được gửi lại thành công',
      email: email,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    console.log('changePasswordDto===', changePasswordDto);
    // Tìm user theo ID
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await comparePasswordHelper(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    // Kiểm tra mật khẩu mới khác mật khẩu cũ
    if (oldPassword === newPassword) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await hashPasswordHelper(newPassword);

    // Cập nhật mật khẩu
    await this.userModel.updateOne(
      { _id: userId },
      { password: hashedNewPassword },
    );

    return {
      message: 'Mật khẩu đã được thay đổi thành công',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email, code, newPassword } = forgotPasswordDto;

    // Tìm user theo email và code
    const user = await this.userModel.findOne({
      email: email,
      codeId: code,
    });

    if (!user) {
      throw new BadRequestException('Email hoặc mã xác thực không đúng');
    }

    // Kiểm tra mã có hết hạn không
    const isCodeExpired = dayjs().isAfter(user.codeExpired);
    if (isCodeExpired) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await hashPasswordHelper(newPassword);

    // Cập nhật mật khẩu và xóa codeId
    await this.userModel.updateOne(
      { _id: user._id },
      {
        password: hashedNewPassword,
        codeId: null,
        codeExpired: null,
      },
    );

    return {
      message: 'Mật khẩu đã được đặt lại thành công',
      email: email,
    };
  }
}
