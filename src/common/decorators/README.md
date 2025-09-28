# Common API Response Decorators

This module provides reusable decorators for common API response patterns in the application.

## Usage

Import the decorators in your controller:

```typescript
import { ApiResponses } from 'src/common/decorators';
```

## Available Decorators

### Basic Response Decorators

- `@ApiResponses.ok(description?)` - 200 OK response
- `@ApiResponses.created(description?)` - 201 Created response
- `@ApiResponses.badRequest()` - 400 Bad Request response
- `@ApiResponses.unauthorized()` - 401 Unauthorized response
- `@ApiResponses.forbidden(description?)` - 403 Forbidden response
- `@ApiResponses.notFound(description?)` - 404 Not Found response

### Combined Pattern Decorators

- `@ApiResponses.standardGet(description?)` - Standard GET endpoint responses (200, 401, 403)
- `@ApiResponses.standardPost(description?)` - Standard POST endpoint responses (201, 400, 401, 403)
- `@ApiResponses.standardPatch(description?)` - Standard PATCH endpoint responses (200, 400, 401, 403)
- `@ApiResponses.standardDelete(description?)` - Standard DELETE endpoint responses (200, 401, 403, 404)

### Profile-Specific Decorators

- `@ApiResponses.profileGet()` - Profile GET endpoint responses (200, 401)
- `@ApiResponses.profileUpdate()` - Profile UPDATE endpoint responses (200, 400, 401)

## Examples

### Before (repetitive code):

```typescript
@ApiOperation({ summary: 'Update user profile' })
@ApiResponse({ status: 200, description: 'Profile updated successfully' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
  // ...
}
```

### After (using common decorators):

```typescript
@ApiOperation({ summary: 'Update user profile' })
@ApiResponses.profileUpdate()
async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
  // ...
}
```

## Benefits

1. **DRY Principle**: Eliminates repetitive `@ApiResponse` decorators
2. **Consistency**: Ensures consistent response documentation across all endpoints
3. **Maintainability**: Changes to response patterns only need to be made in one place
4. **Readability**: Makes controller methods cleaner and more focused on business logic
