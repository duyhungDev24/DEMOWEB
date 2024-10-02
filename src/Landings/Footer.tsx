import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between mb-6">
        {/* Liên hệ */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
          <p>Địa chỉ: 88 Ngõ 86 Phúc Diễn Bắc, Từ Liêm, Hà Nội</p>
          <p>Điện thoại: <a href="tel:0394879813" className="hover:text-sky-400">0394 879 813</a></p>
          <p>Email: <a href="mailto:nguyenduyhung3624@gmail.com" className="hover:text-sky-400">nguyenduyhung3624@gmail.com</a></p>
        </div>

        {/* Chính sách */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Chính sách</h2>
          <ul className="space-y-2">
            <li><a href="/warranty" className="hover:text-sky-400">Chính sách bảo hành</a></li>
            <li><a href="/return" className="hover:text-sky-400">Chính sách đổi trả</a></li>
            <li><a href="/payment" className="hover:text-sky-400">Chính sách thanh toán</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h2>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              <FaFacebookF size={20} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              <FaTwitter size={20} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Phần cuối cùng */}
      <div className="text-center border-t border-gray-700 pt-4">
        <p>&copy; {currentYear} Cyber Monday . Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
};

export default Footer;
