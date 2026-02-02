## Vĩnh Khánh Food Map 🍜

Ứng dụng di động giúp khám phá đồ ăn – thức uống khu vực **Vĩnh Khánh, Quận 4**.  
Người dùng có thể xem bản đồ các quán xung quanh, lọc theo tên, xem gợi ý món nổi bật và điều hướng sang màn chi tiết quán.

### Tính năng chính

- **Đăng nhập / Đăng ký**: Giao diện auth hiện đại, hỗ trợ nhập số điện thoại hoặc email.
- **Bản đồ quán ăn**:
  - Hiển thị **Google Map** làm nền chính (React Native Maps).
  - Marker cho từng quán ăn / quán cà phê ở khu vực Vĩnh Khánh.
  - Hiển thị **bottom sheet** với thông tin quán, khoảng cách, danh sách món nổi bật kèm điểm số.
- **Tìm kiếm**:
  - Thanh search tiếng Việt: *"Tìm quán ăn, cà phê..."*.
  - Lọc realtime theo tên quán trên bản đồ và trong bottom sheet.
- **Thanh tab (bottom tabs)**:
  - Các tab: Khám phá, Thư viện, Tạo mới, Mã, Cài đặt.
  - Icon SF Symbols (iOS) + Material Icons (Android/web), màu sắc được tối ưu để khi bấm **không bị mất màu**.

### Công nghệ sử dụng

- **React Native + Expo**
- **Expo Router** (file-based routing, nested routes `(auth)`, `(tabs)`)
- **React Native Maps** (Google Map)
- **Expo Location** (chuẩn bị cho tính năng định vị người dùng)
- **TypeScript**, ESLint

### Cấu trúc chính

- `app/(auth)/*`: màn hình đăng nhập, đăng ký.
- `app/(tabs)/*`: layout bottom tabs và các màn chính.
- `components/HomeScreen/*`:
  - `HomeScreen.tsx`: logic màn hình bản đồ.
  - `HomeScreen.styles.ts`: style tách riêng.
  - `data.ts`, `types.ts`: mock data & type cho quán ăn/món ăn.
  - `components/`: `SearchBar`, `ModeToggle`, `PlaceSheet` cho UI map.

### Cách chạy dự án

1. Cài đặt dependency:

   ```bash
   npm install
   ```

2. Chạy app:

   ```bash
   npx expo start
   ```

3. Mở trên:

- Expo Go (QR code)
- iOS Simulator
- Android Emulator

