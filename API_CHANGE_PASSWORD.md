# API Change Password - Thay đổi mật khẩu

## Tổng quan

API này cho phép người dùng đã đăng nhập thay đổi mật khẩu của họ bằng cách cung cấp mật khẩu cũ và mật khẩu mới.

## Endpoint

```
PUT /auth/change-password
```

## Authentication

API này yêu cầu authentication. Người dùng phải gửi JWT token trong header `Authorization`.

```
Authorization: Bearer <jwt_token>
```

## Request Body

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}
```

## Response

### Thành công (200)

```json
{
  "message": "Mật khẩu đã được thay đổi thành công"
}
```

### Lỗi (400)

#### Mật khẩu cũ không đúng

```json
{
  "statusCode": 400,
  "message": "Mật khẩu cũ không đúng",
  "error": "Bad Request"
}
```

#### Mật khẩu mới giống mật khẩu cũ

```json
{
  "statusCode": 400,
  "message": "Mật khẩu mới phải khác mật khẩu cũ",
  "error": "Bad Request"
}
```

#### Người dùng không tồn tại

```json
{
  "statusCode": 400,
  "message": "Người dùng không tồn tại",
  "error": "Bad Request"
}
```

### Lỗi (401) - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Tính năng

1. **Authentication Required**: API yêu cầu người dùng phải đăng nhập
2. **Validation**: Kiểm tra mật khẩu cũ có đúng không
3. **Security Check**: Đảm bảo mật khẩu mới khác mật khẩu cũ
4. **Password Hashing**: Mật khẩu mới được hash trước khi lưu vào database
5. **User Verification**: Kiểm tra người dùng có tồn tại trong hệ thống

## Cách sử dụng

### 1. Sử dụng curl

```bash
curl -X PUT http://localhost:3000/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

### 2. Sử dụng JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    oldPassword: 'password123',
    newPassword: 'newPassword456',
  }),
});

const result = await response.json();
console.log(result);
```

### 3. Sử dụng Postman

- Method: PUT
- URL: `http://localhost:3000/auth/change-password`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body (raw JSON):

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}
```

## Lưu ý

- API này yêu cầu authentication (JWT token)
- Mật khẩu mới sẽ được hash bằng bcrypt trước khi lưu
- Mật khẩu mới phải khác mật khẩu cũ
- User ID được lấy từ JWT token (req.user.sub)
- API sẽ trả về lỗi nếu mật khẩu cũ không đúng
- API sẽ trả về lỗi nếu người dùng không tồn tại

## Security

- Mật khẩu được hash bằng bcrypt với salt rounds
- JWT token được sử dụng để xác thực người dùng
- Không lưu trữ mật khẩu dạng plain text
- Kiểm tra tính hợp lệ của mật khẩu cũ trước khi thay đổi
