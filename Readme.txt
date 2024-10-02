Đây là dự án demo nhỏ của một trang web bán hàng

*Sử dung: React, Tailwind CSS, Json-server 0.17.4, json-server-auth
+ Thư viện Ant Design
+ Thư viện React Query

*Sử dụng: npm i, npm run dev, npm run server

*Các chức năng: 
 + Admin: 
    1. Sản phẩm:   Danh sách sản phẩm, thêm, sửa và xoá.
    Lọc sản phẩm theo tên, danh mục
    Lọc theo thời gian tạo, cập nhật
    2. Danh mục: Danh mục sản phẩm,
    Lọc theo thời gian tạo. Xoá, thêm, hiển thị, và ẩn
    3.  Đơn hàng: Hiển thị danh sách đơn hàng, lọc theo khoảng thời gian.
    4.  Khách hàng: Hiển thị danh sách khách hàng, xoá, sửa role.
 +User: 
    1. Sản phẩm: Hiển thị sản phẩm, sản phẩm nổi bật, lọc được theo danh sách, tìm kiếm sản phẩm,
    Thêm vào yêu thích, thêm vào giỏ hàng, xoá giỏ hàng và đặt hàng.
    2. Tài khoản:  Hiển thị thông tin tài khoản, đổi mật khẩu và quên mật khẩu.
    Khi có role Admin có thể truy cập trang Admin, nếu không thì chỉ có thể ở trang người dùng.
    Đăng xuất tài khoản.

*Chú ý: Dự án có lỗi khi chuyển từ trang sửa và thêm về trang hiển thị danh sách sản phẩm của Admin: Khi chuyển từ một trong hai trang nói trên về trang quản lý nó hiện lỗi không đọc được dữ liệu category.map nhưng khi ấn reload
lại trang thì lại có thể hiển thị...
    
* Đây là một dự án demo nên không được chi tiết và hoàn chỉnh . Có thể có lỗi và không được tối ưu. 
Cảm ơn vì đã bỏ thời gian thử nghiệm..
