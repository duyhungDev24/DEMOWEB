import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from 'react-icons/fa';
import { Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

const Header: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const location = useLocation();
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);
    } else {
      setUserEmail(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserEmail(null);
    queryClient.invalidateQueries({ queryKey: ['userData'] });
    queryClient.removeQueries({ queryKey: ['userData'] });
    navigate('/signin', { replace: true });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <h5 className="text-2xl font-bold tracking-wide mb-1.5">Home</h5>
          </Link>
        </div>

        {/* Menu và Search */}
        <nav className="flex-grow flex justify-center space-x-8 items-center">
          <Link to="/" className="hover:text-sky-400">Trang chủ</Link>
          <Link to="/productslist" className="hover:text-sky-400">Sản phẩm</Link>
          <Link to="/about" className="hover:text-sky-400">Về Chúng Tôi</Link>
          <Link to="/contact" className="hover:text-sky-400">Liên Hệ</Link>
          
          {/* Search */}
          <div className="relative ml-8 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black text-white p-2 rounded border border-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sky-400"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>
        </nav>

        {/* Icons và Logout */}
        <div className="flex-shrink-0 flex justify-end items-center space-x-4">
          {/* Điều hướng đến /userId/carts */}
          <Link to={`/${userId}/carts`} className="hover:text-sky-400 flex items-center space-x-1">
            <FaShoppingCart /> <span>Giỏ hàng</span>
          </Link>

          <Link to="/favorites" className="hover:text-sky-400 flex items-center space-x-1">
            <FaHeart /> <span>Yêu thích</span>
          </Link>

          {userEmail ? (
            <Link to="/profile" className="hover:text-sky-400 flex items-center space-x-2">
              <FaUser /> <span>{userEmail}</span>
            </Link>
          ) : (
            <Link to="/signin" className="hover:text-sky-400 flex items-center space-x-2">
              <FaUser /> <span>Đăng nhập</span>
            </Link>
          )}

          {userEmail && (
            <Button 
              className="bg-sky-600 text-white hover:bg-sky-700" 
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
