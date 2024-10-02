import instance from '@/configs/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Button, message, Skeleton, Select } from 'antd';
import React, { useState } from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  userId: number[];
  categoryId: number;
}

interface Favorite {
  id: number;
  productId: number;
  userId: number[];
}

const ProductsList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = loggedInUser?.id;

  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await instance.get('/products');
      return response.data;
    },
    enabled: !!userId,
  });

  const { data: favorites, isLoading: isLoadingFavorites, isError: isErrorFavorites, error: errorFavorites } = useQuery<Favorite[], Error>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await instance.get('/favorites');
      return response.data;
    },
    enabled: !!userId,
  });

  const mutationAddFavorite = useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      const existingFavorite = favorites?.find(fav => fav.productId === productId);
      if (existingFavorite) {
        if (!existingFavorite.userId.includes(userId)) {
          const updatedUserIds = [...existingFavorite.userId, userId];
          await instance.patch(`/favorites/${existingFavorite.id}`, { userId: updatedUserIds });
        }
      } else {
        await instance.post('/favorites', { productId, userId: [userId] });
      }
    },
    onSuccess: () => {
      messageApi.open({ type: 'success', content: 'Đã thêm vào yêu thích' });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: any) => {
      messageApi.open({ type: 'error', content: error.message || 'Lỗi khi thêm vào yêu thích' });
    },
  });

  const mutationRemoveFavorite = useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      const existingFavorite = favorites?.find(fav => fav.productId === productId);
      if (existingFavorite) {
        const updatedUserIds = existingFavorite.userId.filter(id => id !== userId);
        if (updatedUserIds.length === 0) {
          await instance.delete(`/favorites/${existingFavorite.id}`);
        } else {
          await instance.patch(`/favorites/${existingFavorite.id}`, { userId: updatedUserIds });
        }
      }
    },
    onSuccess: () => {
      messageApi.open({ type: 'success', content: 'Đã xóa khỏi yêu thích' });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: any) => {
      messageApi.open({ type: 'error', content: error.message || 'Lỗi khi xóa yêu thích' });
    },
  });

  const handleAddFavorite = (productId: number) => {
    mutationAddFavorite.mutate(productId);
  };

  const handleRemoveFavorite = (productId: number) => {
    mutationRemoveFavorite.mutate(productId);
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
  };

  if (isLoadingProducts || isLoadingFavorites) return <Skeleton active />;
  if (isErrorProducts) return <div>Lỗi khi tải sản phẩm: {errorProducts.message}</div>;
  if (isErrorFavorites) return <div>Lỗi khi tải yêu thích: {errorFavorites.message}</div>;

  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.categoryId === selectedCategory) 
    : products;

  const resetFilteredProducts = () => {
    setSelectedCategory(null);
  }

  return (
    <div className="container mx-auto py-12">
      {contextHolder}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <Select
          placeholder="Chọn danh mục"
          onChange={handleCategoryChange}
          className="ml-4 w-1/4"
          options={[
            { label: 'Tất cả', value: resetFilteredProducts },
            { label: 'Iphone', value: 1 },
            { label: 'Xiaomi', value: 2 },
            { label: 'Samsung', value: 3 },
            { label: 'Oppo', value: 4 },
            { label: 'Vivo', value: 5 },
            { label: 'Bphone', value: 6 },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => {
            const isFavorited = favorites?.some(fav => fav.productId === product.id && fav.userId.includes(userId));
            return (
              <Card
                key={product.id}
                cover={<img src={product.image} alt={product.title} />}
                title={product.title}
                actions={[
                  isFavorited ? (
                    <Button 
                      type="primary" 
                      danger 
                      icon={<HeartOutlined />} 
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      Xóa Yêu Thích
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      icon={<HeartOutlined />} 
                      onClick={() => handleAddFavorite(product.id)}
                    >
                      Yêu thích
                    </Button>
                  ),
                  <Button 
                    type="primary" 
                    onClick={() => handleViewDetails(product.id)}
                  >
                    Xem Chi Tiết
                  </Button>
                ]}
              >
                <p>Giá: {product.price.toLocaleString()} VND</p>
                <p>Mô tả: {product.description}</p>
              </Card>
            )
          })
        ) : (
          <div>Không có sản phẩm nào.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
