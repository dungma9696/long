import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

// Common API Response patterns
export const ApiResponses = {
  // Standard success responses
  ok: (description: string = 'Success') =>
    applyDecorators(ApiResponse({ status: 200, description })),

  created: (description: string = 'Created successfully') =>
    applyDecorators(ApiResponse({ status: 201, description })),

  // Standard error responses
  badRequest: () =>
    applyDecorators(ApiResponse({ status: 400, description: 'Bad request' })),

  unauthorized: () =>
    applyDecorators(ApiResponse({ status: 401, description: 'Unauthorized' })),

  forbidden: (description: string = 'Forbidden') =>
    applyDecorators(ApiResponse({ status: 403, description })),

  notFound: (description: string = 'Not found') =>
    applyDecorators(ApiResponse({ status: 404, description })),

  // Combined common patterns
  standardGet: (successDescription: string = 'Retrieved successfully') =>
    applyDecorators(
      ApiResponse({ status: 200, description: successDescription }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
      ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
      }),
    ),

  standardPost: (successDescription: string = 'Created successfully') =>
    applyDecorators(
      ApiResponse({ status: 201, description: successDescription }),
      ApiResponse({ status: 400, description: 'Bad request' }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
      ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
      }),
    ),

  standardPatch: (successDescription: string = 'Updated successfully') =>
    applyDecorators(
      ApiResponse({ status: 200, description: successDescription }),
      ApiResponse({ status: 400, description: 'Bad request' }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
      ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
      }),
    ),

  standardDelete: (successDescription: string = 'Deleted successfully') =>
    applyDecorators(
      ApiResponse({ status: 200, description: successDescription }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
      ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
      }),
      ApiResponse({ status: 404, description: 'Not found' }),
    ),

  // Profile specific patterns
  profileGet: () =>
    applyDecorators(
      ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
      }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
    ),

  profileUpdate: () =>
    applyDecorators(
      ApiResponse({ status: 200, description: 'Profile updated successfully' }),
      ApiResponse({ status: 400, description: 'Bad request' }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
    ),
};
