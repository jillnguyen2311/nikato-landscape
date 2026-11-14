# Nikato Landscape

Source code cho website Nikato Landscape Maintenance Inc. Project dùng Node.js để tạo các trang HTML tĩnh, có CSS và JavaScript riêng. Hai video nền và các ảnh từ website Wix nằm trong project. Không cần cài package.

## Mở và chạy trong VS Code

1. Mở thư mục `nikato-landscape` trong VS Code.
2. Cài Node.js 20 trở lên nếu máy chưa có.
3. Mở Terminal và chạy `npm.cmd run dev` trên Windows PowerShell. Trên macOS/Linux dùng `npm run dev`.
4. Xem [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

Khởi động lại lệnh dev sau khi chỉnh file để tạo lại trang và asset. Để chỉ tạo bản tĩnh, chạy `npm.cmd run build`. File xuất ra nằm trong `dist/`.

Để xem trực tiếp trong trình duyệt mà không chạy server, dùng `npm.cmd run build:offline` rồi mở `preview/index.html`. Bản xem này lấy ảnh, video, CSS và JavaScript trong `public/`. Giữ nguyên cấu trúc thư mục khi giải nén.

| Cần sửa | File |
| --- | --- |
| Tên, số điện thoại, email, địa chỉ, dịch vụ và mô tả ảnh dự án | `src/content.mjs` |
| Nội dung và bố cục HTML từng trang | `src/pages.mjs` |
| Màu, typography, desktop và mobile | `public/styles/site.css` |
| Menu, gallery và hiệu ứng cuộn | `public/site.js` |
| Ảnh và logo | `public/images/` |

## Những thay đổi từ bản Wix

- **Home** bám sát logo ở giữa, menu pastel, hai video nền và thứ tự các khối của Wix. Banner đầu trang và ảnh sân vườn có parallax khi cuộn. Video tự phát khi vào màn hình, dừng khi ra ngoài khung nhìn và tôn trọng cài đặt giảm chuyển động.
- **Services** giữ lưới hai cột, đủ tám nhóm dịch vụ và khôi phục ảnh nền của khối báo giá cuối trang. Mỗi nhóm có mô tả và nút Get an estimate dẫn đến Contact.
- **Past Projects** hiển thị cả sáu ảnh trên trang Home. Có chức năng mở ảnh lớn và điều hướng bằng bàn phím.
- **About** dùng lại ảnh banner, nội dung “The Full Story” và icon mạng xã hội. Facebook dẫn đến trang ghi trên Wix. Ba icon còn lại chỉ dùng để đối chiếu bố cục vì link gốc dẫn đến tài khoản Wix. Đã sửa cách viết “Nitako” thành “Nikato”.
- **Contact** dùng ảnh Wix làm nền toàn chiều ngang, có nút nhắn SMS, email và hai địa chỉ riêng. Nhãn “Text (or call)” ưu tiên SMS và có liên kết gọi riêng. Bản mới dùng `778-697-0726` và `nikatolandscape@gmail.com` theo footer Wix. Xác nhận thông tin này cùng hai địa chỉ trước khi đưa lên domain.
- **Book Online** khôi phục ba thẻ dịch vụ, ảnh, thời lượng và giá USD theo Wix. Nút Book Now mở email nháp với tên dịch vụ trong tiêu đề. Việc xác nhận giá và lịch hẹn diễn ra trực tiếp với khách.
- **Our Clients Say** có đủ ba ảnh, ba nội dung nhận xét và nút chuyển slide như Wix. Một số lỗi câu trong nhận xét đã được chỉnh cho dễ đọc. Xác nhận nội dung và quyền sử dụng ảnh trước khi publish.

Các hiệu ứng xuất hiện và chuyển slide được dựng lại bằng CSS/JavaScript. Giao diện dùng Poppins nếu đã cài trên máy, rồi đến Century Gothic hoặc font hệ thống.

Nguồn nội dung và hình ảnh là [website Wix của Nikato](https://nguyennuduyhoai75.wixsite.com/nikatolandscaper). Trước khi publish, xác nhận quyền sử dụng lại các ảnh minh hoạ của Wix trên hosting ngoài Wix. Ảnh ở trang Projects lấy từ mục Past Projects.

## Đưa lên domain riêng

GitHub Pages dùng workflow `deploy-pages.yml`. Video nền rừng được lưu thành hai phần để tải lên bằng trình duyệt. Lệnh build tự ghép hai phần thành một tệp MP4.

### Bản tĩnh trên hosting bất kỳ

1. Chạy `npm.cmd run build`.
2. Đưa **nội dung của `dist/`** lên thư mục web root của hosting. Hosting cần phục vụ `index.html` trong các thư mục như `/services/`.
3. Thêm domain tại nhà cung cấp hosting, rồi cập nhật DNS tại nơi mua domain theo thông số hosting cấp. Kiểm tra HTTPS và các đường dẫn sau khi DNS hoạt động.
