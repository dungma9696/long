# Hệ thống quản lý ghế cho Showtimes

## Tổng quan

Hệ thống đã được cập nhật để quản lý giá tiền cho từng loại ghế và trạng thái đặt chỗ một cách chi tiết.

## Các thay đổi chính

### 1. Enum SeatStatus

- `AVAILABLE`: Ghế trống, có thể đặt
- `BOOKED`: Ghế đã được đặt chỗ
- `RESERVED`: Ghế đang được giữ chỗ (có thời hạn)
- `MAINTENANCE`: Ghế đang bảo trì

### 2. Schema Showtime

- Thay đổi từ `price: number` thành `pricing: { regular: number, vip: number, couple: number }`
- Cho phép thiết lập giá khác nhau cho từng loại ghế

### 3. Schema Seat mới

- Quản lý từng ghế riêng biệt
- Lưu trữ thông tin: showtime, row, seatNumber, seatType, price, status
- Theo dõi người đặt, thời gian đặt, thời gian hết hạn

## API Endpoints mới

### Lấy thông tin ghế

```
GET /showtimes/:id/seats - Lấy tất cả ghế của showtime
GET /showtimes/:id/seats/available - Lấy ghế còn trống
GET /showtimes/:id/pricing - Lấy giá tiền theo loại ghế
```

### Quản lý đặt chỗ

```
POST /showtimes/:id/seats/reserve - Giữ chỗ ghế (có thời hạn)
POST /showtimes/:id/seats/book - Đặt chỗ ghế (chính thức)
POST /showtimes/:id/seats/release - Hủy giữ chỗ
```

## Quy trình đặt chỗ

1. **Khởi tạo ghế**: Khi tạo showtime mới, hệ thống tự động tạo ghế dựa trên room layout
2. **Giữ chỗ**: User có thể giữ chỗ ghế trong 15 phút (có thể tùy chỉnh)
3. **Đặt chỗ**: Chuyển từ trạng thái reserved sang booked khi thanh toán thành công
4. **Tự động dọn dẹp**: Hệ thống tự động release ghế hết hạn mỗi phút

## Cách sử dụng

### Tạo showtime với pricing

```json
{
  "movie": "64a1b2c3d4e5f6789012345a",
  "cinema": "CGV Vincom",
  "address": "123 Nguyễn Huệ, Q1, HCM",
  "showtime": "2024-01-15T19:00:00.000Z",
  "date": "2024-01-15T00:00:00.000Z",
  "room": "64a1b2c3d4e5f6789012345b",
  "pricing": {
    "regular": 100000,
    "vip": 150000,
    "couple": 200000
  }
}
```

### Giữ chỗ ghế

```json
{
  "seatIds": ["64a1b2c3d4e5f6789012345c", "64a1b2c3d4e5f6789012345d"],
  "expiresInMinutes": 15
}
```

### Đặt chỗ ghế

```json
{
  "seatIds": ["64a1b2c3d4e5f6789012345c", "64a1b2c3d4e5f6789012345d"],
  "bookingId": "64a1b2c3d4e5f6789012345e"
}
```

## Lưu ý quan trọng

1. **Authentication**: Các API đặt chỗ yêu cầu xác thực user
2. **Transaction**: Các thao tác đặt chỗ sử dụng MongoDB transaction để đảm bảo tính nhất quán
3. **Auto cleanup**: Hệ thống tự động dọn dẹp ghế hết hạn mỗi phút
4. **Seat layout**: Cần đảm bảo room layout có cấu trúc đúng để khởi tạo ghế

## Cấu trúc Room Layout

Room layout cần có cấu trúc JSON như sau:

```json
[
  {
    "row": "A",
    "seats": [
      { "number": "1", "type": "regular" },
      { "number": "2", "type": "vip" },
      { "number": "3", "type": "couple" }
    ]
  }
]
```
