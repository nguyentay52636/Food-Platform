 Backend Stack (Hệ thống máy chủ)
NestJS: Framework Node.js mạnh mẽ để xây dựng các API (hiện đang chạy lệnh nest start).
MongoDB: Cơ sở dữ liệu NoSQL dùng để lưu trữ dữ liệu POI, Tour và thông tin người dùng.
Axios: Thư viện để frontend kết nối và gọi dữ liệu từ backend API.
3. Công nghệ Audio & Đa ngôn ngữ (Phần mình vừa làm)
Web Speech API (speechSynthesis): Công nghệ trình duyệt cho phép chuyển đổi văn bản thành giọng nói (TTS) để người dùng nghe thử nội dung mô tả ngay trên web mà không cần server audio riêng.
Hệ thống i18n (Internationalization): Quản lý nội dung đa ngôn ngữ (Việt, Anh, Trung,...) thông qua các bộ từ điển JSON và API cấu hình ngôn ngữ linh hoạt.
4. Những gì mình vừa tối ưu:
Dynamic Language Loading: Chuyển đổi từ danh sách ngôn ngữ cứng (static) sang hệ thống lấy từ API, giúp hệ thống tự động cập nhật khi bạn thêm ngôn ngữ mới vào cơ sở dữ liệu.
Responsive Mapping: Ánh xạ dữ liệu phức tạp từ Backend (như poiNgonNgu) thành giao diện trực quan cho admin dễ dàng quản lý.
Hy vọng những thông tin này giúp bạn nắm rõ hơn về "nội lực" của hệ thống chúng ta đang xây dựng! Bạn có muốn mình giải thích chi tiết hơn về phần nào không?



. Phía Backend (Máy chủ xử lý)
Khi bạn thực hiện tạo một POI mới, quy trình diễn ra hoàn toàn tự động để giảm bớt việc nhập liệu thủ công:

Bước 1: Tiếp nhận dữ liệu: Backend nhận các thông tin cơ bản (Tên POI, tọa độ, mô tả...) thông qua CreatePoiDto.
Bước 2: Lưu POI gốc: Lưu thông tin chung vào cơ sở dữ liệu MongoDB.
Bước 3: Tự động hóa bản dịch (Vòng lặp ngôn ngữ):
Hệ thống gọi vào bảng Language để lấy danh sách tất cả các ngôn ngữ đang hỗ trợ (Việt, Anh, Nhật, Pháp...).
Với mỗi ngôn ngữ, hệ thống tự tạo một bản ghi dịch thuật (PoiTranslation).
Bước 4: Tạo âm thanh (Google TTS):
Hệ thống lấy nội dung moTa gửi lên Google Cloud để chuyển thành giọng nói theo mã ngôn ngữ tương ứng (ví dụ: vi dùng giọng Việt, en dùng giọng Mỹ).
File .mp3 được lưu vào thư mục public/audio/ trên server.
Cập nhật đường dẫn file đó (audioUrl) vào cơ sở dữ liệu.
2. Luồng dữ liệu (API)
Request: Frontend gửi 1 cục dữ liệu đơn giản.
Response: Khi lấy dữ liệu POI, Backend trả về một cấu trúc phức tạp gồm thông tin POI kèm theo nội dung poiNgonNgu đã được xử lý (gồm tiêu đề, mô tả và file audio đã tạo sẵn).
3. Phía Frontend (Giao diện người dùng)
Sau khi dữ liệu đã sẵn sàng, Frontend sẽ hiển thị linh hoạt trong các Component (như DialogDetailAudio mà bạn vừa sửa):

Lấy danh sách ngôn ngữ động: Thay vì dùng danh sách cứng, Frontend gọi API useLanguages để hiển thị đúng những gì Backend đang có.
Hiển thị thông minh:
Nếu POI có thông tin dịch thuật (poiNgonNgu), giao diện sẽ ưu tiên hiển thị nội dung đó (Tiêu đề, Mô tả riêng cho ngôn ngữ).
Nếu có file âm thanh sẵn từ Server, trình phát nhạc sẽ hiện ra cho phép người dùng nghe.
Preview (Dự phòng): Nếu chưa có file audio từ Server, hệ thống vẫn cho phép người dùng dùng tính năng "Preview" của trình duyệt (Web Speech API) để nghe thử giọng đọc máy.
Tóm lại:
Quy trình này giúp bạn chỉ cần nhập dữ liệu 1 lần bằng tiếng Việt, hệ thống sẽ tự động chuẩn bị sẵn sàng cấu trúc cho 20 loại ngôn ngữ khác nhau kèm theo file âm thanh tương ứng, giúp admin quản lý cực kỳ nhanh chóng và chuyên nghiệp.

Bạn có muốn tôi làm rõ thêm mã nguồn ở phần nào (như cách ánh xạ dữ liệu hay cách xử lý âm thanh) không?

