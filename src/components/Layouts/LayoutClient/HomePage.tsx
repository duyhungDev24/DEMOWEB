import React from 'react';
import banner4 from '../../../assets/images/banner4.jpg';
import { Link } from 'react-router-dom';
import useAuth from '@/components/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';



const HomePage: React.FC = () => {

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await instance.get('/products');
      return response.data;
    },
  });

  // Fetch categories
  {/*const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await instance.get('/categories');
      return response.data;
    },
  });*/}

  const featuredProducts = products?.filter((product: any) => product.isFeatured);

  const userRole = useAuth();

  return (
    <div>
      <div>
        {/* Banner Section */}
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${banner4})` }}
        >
          <div className="absolute inset-0 bg-slate-500 opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-sky-50">
              <h1 className="text-5xl font-bold mb-4">
                Chào mừng đến với cửa hàng điện thoại
              </h1>
              <p className="text-lg mb-6">
                Những dòng điện thoại mới nhất với giá ưu đãi
              </p>
              <a
                href="/productslist"
                className="bg-blue-500 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition"
              >
                Khám phá sản phẩm
              </a>
              {userRole === 'admin' && (
                <Link to="admin">
                  <button className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition mt-4 ml-4">
                    Đi đến Trang Admin
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Featured Products Section */}
        <section className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts?.map((product: any) => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 10px"
                  />
                  <h3 className="text-2xl font-semibold mb-2 text-slate-500">{product.title}</h3>
                  <p className="text-gray-700 mb-4">Giá: {product.price} VND</p>
                  <a
                    href={`/product/${product.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Xem chi tiết
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
