import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, InputNumber, message, Skeleton } from 'antd';
import instance from '@/configs/axios';

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = loggedInUser?.id;

  const { data, isLoading, isError, error } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await instance.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, quantity, userId, title, price, image }: any) => {
      try {
        const response = await instance.get(`/carts`);
        const cartsData = response.data;

        if (cartsData.length === 0) {
          return instance.post('/carts', {
            userId,
            products: [{ productId: id, quantity, title, price, image }],
          });
        } else {
          const existingCart = cartsData.find((cart: any) => cart.userId === userId);

          if (existingCart) {
            const existingProduct = existingCart.products.find((product: any) => product.productId === id);

            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
              existingCart.products.push({ productId: id, quantity, title, price, image });
            }

            return instance.put(`/carts/${existingCart.id}`, existingCart);
          } else {
            return instance.post('/carts', {
              userId,
              products: [{ productId: id, quantity, title, price, image }],
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        throw new Error("Lỗi API");
      }
    },

    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm vào giỏ hàng thành công",
      });
      navigate(`/${id}/carts`);
    },

    onError: (error: any) => {
      console.error('Error:', error);
      messageApi.open({
        type: "error",
        content: error.message || 'Thêm vào giỏ hàng thất bại',
      });
    },
  });

  const handleAddToCart = () => {
    if (!userId) {
      messageApi.open({
        type: "error",
        content: "Vui lòng đăng nhập để thêm vào giỏ hàng",
      });
      return;
    }

    setLoadingAdd(true);

    if (data) {
      mutateAsync({ 
        id, 
        quantity, 
        userId,
        title: data.title,   
        price: data.price,
        image: data.image    
      }).finally(() => {
        setLoadingAdd(false);
      });
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (isError || !data) {
    console.error("Error fetching product:", error);
    return <div className="text-center text-red-600">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-8 flex flex-col md:flex-row">
      {contextHolder}
      <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
        <img src={data?.image} alt={data?.title} className="w-full h-auto rounded-lg shadow-lg" />
      </div>
      <div className="md:w-1/2 md:pl-8">
        <h1 className="text-3xl font-bold mb-4">{data?.title}</h1>
        <p className="text-xl text-green-600 font-semibold mb-4">${data?.price?.toFixed(2)}</p>
        <p className="text-gray-700 mb-4">{data?.description}</p>
        <div className="flex items-center mb-4">
          <span className="mr-2 text-lg font-medium">Số lượng:</span>
          <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value ?? 1)} />
        </div>
        <Button type="primary" size="large" onClick={handleAddToCart} loading={loadingAdd}>
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
