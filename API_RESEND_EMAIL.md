# API Resend Email - Gửi lại mã UUID

## Tổng quan

API này cho phép người dùng yêu cầu gửi lại email chứa mã UUID để kích hoạt tài khoản.

## Endpoint

```
POST /auth/resend-email
```

## Request Body

```json
{
  "email": "user@example.com"
}
```

## Response

### Thành công (200)

```json
{
  "message": "Email đã được gửi lại thành công",
  "email": "user@example.com"
}
```

### Lỗi (400)

```json
{
  "statusCode": 400,
  "message": "Email khong ton tai: user@example.com",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Tai khoan da duoc kich hoat",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Lỗi gửi email",
  "error": "Bad Request"
}
```

## Tính năng

1. **Kiểm tra email tồn tại**: API sẽ kiểm tra xem email có tồn tại trong hệ thống không
2. **Kiểm tra trạng thái tài khoản**: Chỉ cho phép gửi lại email cho tài khoản chưa được kích hoạt
3. **Tạo mã UUID mới**: Mỗi lần gửi lại sẽ tạo một mã UUID mới
4. **Cập nhật thời gian hết hạn**: Thời gian hết hạn của mã sẽ được reset về 1 phút từ thời điểm hiện tại
5. **Gửi email**: Sử dụng template `register.hbs` để gửi email với mã mới

## Cách sử dụng

### 1. Sử dụng curl

```bash
curl -X POST http://localhost:3000/auth/resend-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Sử dụng JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/auth/resend-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
  }),
});

const result = await response.json();
console.log(result);
```

### 3. Sử dụng Postman

- Method: POST
- URL: `http://localhost:3000/auth/resend-email`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "user@example.com"
}
```

## Lưu ý

- API này là public (không cần authentication)
- Mã UUID mới sẽ có thời gian hết hạn là 1 phút
- Email sẽ được gửi với subject "Mã kích hoạt mới - Smart Learn"
- Chỉ có thể gửi lại email cho tài khoản chưa được kích hoạt
