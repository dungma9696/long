import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponseData } from 'src/common/bases/api-response';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // 500
    let message: string = 'NetWork Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        if (exceptionResponse && typeof exceptionResponse === 'object') {
          const responseObj = exceptionResponse as { message?: string };
          message = responseObj.message || 'Network Error';
        }
      }

      switch (status) {
        case HttpStatus.UNAUTHORIZED: {
          // 401
          message = message || 'Ban can dang nhap de thuc hien hanh dong nay';
          break;
        }
        default: {
          break;
        }
      }
    } else {
      message = 'Loi he thong';
    }

    const apiResponse = ApiResponseData.message(message, status);
    response.status(status).json(apiResponse);
  }
}
