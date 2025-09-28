# API Forgot Password - Quên mật khẩu

## Tổng quan

API này cho phép người dùng đặt lại mật khẩu khi quên mật khẩu bằng cách sử dụng mã UUID đã được gửi qua email trước đó.

## Endpoint

```
POST /auth/forgot-password
```

## Request Body

```json
{
  "email": "user@example.com",
  "code": "uuid-code-from-email",
  "newPassword": "newPassword123"
}
```

## Response

### Thành công (200)

```json
{
  "message": "Mật khẩu đã được đặt lại thành công",
  "email": "user@example.com"
}
```

### Lỗi (400)

#### Email hoặc mã xác thực không đúng

```json
{
  "statusCode": 400,
  "message": "Email hoặc mã xác thực không đúng",
  "error": "Bad Request"
}
```

#### Mã xác thực đã hết hạn

```json
{
  "statusCode": 400,
  "message": "Mã xác thực đã hết hạn",
  "error": "Bad Request"
}
```

## Tính năng

1. **Public API**: Không cần authentication
2. **Code Validation**: Kiểm tra mã UUID có đúng và còn hạn không
3. **Email Verification**: Xác thực email và mã UUID khớp nhau
4. **Password Hashing**: Mật khẩu mới được hash trước khi lưu
5. **Security Cleanup**: Xóa codeId và codeExpired sau khi đặt lại mật khẩu thành công

## Quy trình sử dụng

1. **Bước 1**: Người dùng quên mật khẩu
2. **Bước 2**: Gọi API resend email để nhận mã UUID mới
3. **Bước 3**: Kiểm tra email và lấy mã UUID
4. **Bước 4**: Gọi API forgot password với email, mã UUID và mật khẩu mới
5. **Bước 5**: Mật khẩu được đặt lại thành công

## Cách sử dụng

### 1. Sử dụng curl

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "uuid-code-from-email",
    "newPassword": "newPassword123"
  }'
```

### 2. Sử dụng JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    code: 'uuid-code-from-email',
    newPassword: 'newPassword123',
  }),
});

const result = await response.json();
console.log(result);
```

### 3. Sử dụng Postman

- Method: POST
- URL: `http://localhost:3000/auth/forgot-password`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "user@example.com",
  "code": "uuid-code-from-email",
  "newPassword": "newPassword123"
}
```

## Ví dụ quy trình hoàn chỉnh

### 1. Gửi lại email để nhận mã UUID

```bash
curl -X POST http://localhost:3000/auth/resend-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Đặt lại mật khẩu với mã UUID

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "received-uuid-from-email",
    "newPassword": "myNewPassword123"
  }'
```

## Lưu ý

- API này là public (không cần authentication)
- Mã UUID phải được lấy từ email đã gửi trước đó
- Mã UUID có thời gian hết hạn (thường là 1 phút)
- Sau khi đặt lại mật khẩu thành công, mã UUID sẽ bị xóa
- Mật khẩu mới sẽ được hash bằng bcrypt trước khi lưu
- Email và mã UUID phải khớp với nhau trong database

## Security

- Mã UUID được tạo ngẫu nhiên và có thời gian hết hạn
- Mật khẩu được hash bằng bcrypt với salt rounds
- Không lưu trữ mật khẩu dạng plain text
- Mã UUID chỉ có thể sử dụng một lần
- Kiểm tra thời gian hết hạn của mã trước khi xử lý

## Error Handling

- Kiểm tra email và mã UUID có tồn tại và khớp nhau
- Kiểm tra mã UUID có hết hạn không
- Trả về thông báo lỗi rõ ràng cho từng trường hợp
- Không tiết lộ thông tin nhạy cảm trong thông báo lỗi
