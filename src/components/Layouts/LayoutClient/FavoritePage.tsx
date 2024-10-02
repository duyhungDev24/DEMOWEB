// src/components/FavoritePage.tsx

import React from 'react';
import instance from '@/configs/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Skeleton, message } from 'antd';

interface Favorite {
    id: number;
    productId: number;
    userId: number[];
}

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
}

const FavoritePage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const storedUser = localStorage.getItem('user');
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = loggedInUser?.id;
    const { data: favorites, isLoading: isLoadingFavorites, isError: isErrorFavorites, error: errorFavorites } = useQuery<Favorite[], Error>({
        queryKey: ['favorites'],
        queryFn: async () => {
            const response = await instance.get('/favorites');
            return response.data;
        },
        enabled: !!userId,
    });
    const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await instance.get('/products');
            return response.data;
        },
        enabled: !!userId,
    });

    const userFavorites = favorites?.filter(fav => fav.userId.includes(userId)).map(fav => {
        return products?.find(product => product.id === fav.productId);
    }).filter(Boolean) as Product[];

    const mutationRemoveFavorite = useMutation<void, Error, Favorite>({
        mutationFn: async (favorite: Favorite) => {
            const updatedUserIds = favorite.userId.filter((id: any) => id !== userId);
            if (updatedUserIds.length === 0) {
                await instance.delete(`/favorites/${favorite.id}`);
            } else {
                await instance.patch(`/favorites/${favorite.id}`, { userId: updatedUserIds });
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: 'success',
                content: 'Đã xóa khỏi yêu thích',
            });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        onError: (error: any) => {
            messageApi.open({
                type: 'error',
                content: error.message || 'Lỗi khi xóa yêu thích',
            });
        }
    });

    const handleRemoveFavorite = (favorite: Favorite) => {
        mutationRemoveFavorite.mutate(favorite);
    };

    if (isLoadingFavorites || isLoadingProducts) {
        return <Skeleton active />;
    }

    if (isErrorFavorites || isErrorProducts) {
        return <div>Lỗi khi tải dữ liệu: {errorFavorites?.message || errorProducts?.message}</div>;
    }

    return (
        <div className="container mx-auto py-12">
            {contextHolder}
            <h1 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userFavorites && userFavorites.length > 0 ? (
                    userFavorites.map((product: Product) => {
                        const favorite = favorites?.find(fav => fav.productId === product.id && fav.userId.includes(userId));
                        return (
                            <Card
                                key={product.id}
                                cover={<img src={product.image} alt={product.title} />}
                                title={product.title}
                            >
                                <p>Giá: {product.price.toLocaleString()} VND</p>
                                <p>Mô tả: {product.description}</p>
                                <Button
                                    type='primary'
                                    danger
                                    className='mt-6'
                                    onClick={() => {
                                        if (favorite) {
                                            handleRemoveFavorite(favorite);
                                        }
                                    }}
                                >
                                    Xóa
                                </Button>
                            </Card>
                        )
                    })
                ) : (
                    <div>Không có sản phẩm yêu thích nào.</div>
                )}
            </div>
        </div>
    );
};

export default FavoritePage;
