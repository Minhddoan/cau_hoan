# Phong Thuy Song Vu - Full Stack Application

Đây là dự án hệ thống quản lý và giới thiệu dịch vụ Phong Thủy Song Vũ. Hệ thống bao gồm 3 phần chính:

1. **Backend**: Cung cấp các API RESTful và quản lý cơ sở dữ liệu PostgreSQL.
2. **Admin Dashboard**: Giao diện React dành cho quản trị viên để quản lý dịch vụ, bài viết, người dùng, booking, v.v.
3. **Feng Shui Guide (Trang người dùng)**: Giao diện web React dành cho khách hàng tham khảo dịch vụ, đặt lịch, và xem tin tức phong thủy.

## Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+ (khuyên dùng Node 20+)
- **PostgreSQL**: Cần cài đặt và tạo database trước khi chạy backend. (Đã có file config trong `backend/.env`)

---

## 1. Hướng dẫn chạy Backend

Backend nằm trong thư mục `backend`. Dùng lệnh sau để cài đặt và chạy:

```bash
cd backend
npm install
npm run dev
```
*Backend sẽ chạy trên cổng 3000.*

---

## 2. Hướng dẫn chạy Admin Dashboard

Trang Admin nằm trong thư mục `admin`. Dùng lệnh sau để cài đặt và chạy:

```bash
cd admin
npm install
npm run dev
```
*Frontend Admin sẽ tự động mở trên trình duyệt, thường ở cổng 5173.*

---

## 3. Hướng dẫn chạy Trang Người Dùng (Feng Shui Guide)

Trang chính dành cho khách hàng nằm trong thư mục `Feng Shui Guide`. Dùng lệnh sau để chạy:

```bash
cd "Feng Shui Guide"
# Trong trường hợp bị lỗi dependency khi cài đặt, hãy thử: npm install --legacy-peer-deps
npm install
npm run dev
```
*Frontend khách hàng sẽ chạy ở cấu hình mặc định của Vite, ví dụ cổng 5174.*
