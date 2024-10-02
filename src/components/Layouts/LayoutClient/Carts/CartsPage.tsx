import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Skeleton, InputNumber } from "antd";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

type Cart = {
  id: number;
  userId: number;
  products: {
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }[];
};

const CartsPage = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const queryClient = useQueryClient();

  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = loggedInUser?.id;

  const { data, isLoading, isError } = useQuery<Cart[], Error>({
    queryKey: ["carts"],
    queryFn: async () => {
      const response = await instance.get("/carts");
      return response.data;
    },
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      const userCarts = data.filter((cart) => cart.userId === userId);
      setCarts(userCarts);
    }
  }, [data, userId]);

  const { mutateAsync: removeCartAsync } = useMutation({
    mutationFn: async (cartId: number) => {
      await instance.delete(`/carts/${cartId}`);
    },
    onSuccess: () => {
      message.success("Xóa giỏ hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Xóa giỏ hàng thất bại");
    },
  });

  const { mutateAsync: removeProductAsync } = useMutation({
    mutationFn: async ({
      cartId,
      productId,
    }: {
      cartId: number;
      productId: number;
    }) => {
      const cart = data?.find((cart) => cart.id === cartId);
      if (cart) {
        const updatedProducts = cart.products.filter(
          (product) => product.productId !== productId
        );
        await instance.put(`/carts/${cartId}`, {
          ...cart,
          products: updatedProducts,
        });
      }
    },
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Xóa sản phẩm thất bại");
    },
  });
  const { mutateAsync: updateQuantityAsync } = useMutation({
    mutationFn: async ({
      cartId,
      productId,
      quantity,
    }: {
      cartId: number;
      productId: number;
      quantity: number;
    }) => {
      const cart = data?.find((cart) => cart.id === cartId);
      if (cart) {
        if (quantity === 0) {
          // Xóa sản phẩm nếu số lượng là 0
          await removeProductAsync({ cartId, productId });
        } else {
          // Cập nhật số lượng nếu lớn hơn 0
          const updatedProducts = cart.products.map((product) =>
            product.productId === productId ? { ...product, quantity } : product
          );
          await instance.put(`/carts/${cartId}`, {
            ...cart,
            products: updatedProducts,
          });
        }
      }
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Cập nhật số lượng thất bại");
    },
  });
  

  const handleRemoveProduct = (cartId: number, productId: number) => {
    removeProductAsync({ cartId, productId });
  };

  const handleRemoveCart = (cartId: number) => {
    removeCartAsync(cartId);
  };



  const handleQuantityChange = (
    cartId: number,
    productId: number,
    quantity: number
  ) => {
    updateQuantityAsync({ cartId, productId, quantity });
  };

  const calculateTotal = () => {
    return carts.reduce((total, cart) => {
      return (
        total +
        cart.products.reduce((cartTotal, product) => {
          return cartTotal + product.price * product.quantity;
        }, 0)
      );
    }, 0);
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (isError || !carts) {
    return (
      <div className="text-center text-red-600">Không tìm thấy giỏ hàng</div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
      {carts.map((cart) => (
        <div key={cart.id} className="border-b pb-4 mb-6">
          {cart.products.length === 0 ? (
            <div className="text-center text-gray-600">
              Không có sản phẩm nào trong giỏ
            </div>
          ) : (
            cart.products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{product.title}</h3>
                    <p className="text-gray-500">
                      Số lượng:
                      <InputNumber
                        min={0}
                        value={product.quantity}
                        onChange={(value) =>
                          handleQuantityChange(
                            cart.id,
                            product.productId,
                            value || 1
                          )
                        }
                        className="ml-2"
                      />
                    </p>
                    <p className="text-gray-600">
                      Tổng giá của sản phẩm này : {(product.quantity * product.price).toFixed(2)} VNĐ
                    </p>
                  </div>
                </div>
                <Button
                  type="link"
                  danger
                  onClick={() =>
                    handleRemoveProduct(cart.id, product.productId)
                  }
                >
                  Xóa
                </Button>
              </div>
            ))
          )}
          {cart.products.length > 0 && (
            <Button
              type="primary"
              danger
              onClick={() => handleRemoveCart(cart.id)}
              className="mt-4"
            >
              Xóa toàn bộ giỏ hàng
            </Button>
          )}
        </div>
      ))}
      <div className="flex justify-between items-center mt-8">
        <div className="mt-6 text-xl font-bold">
          Tổng giá phải trả: {calculateTotal().toFixed(2)} VNĐ
        </div>
        <div className="mt-3">
          <Link to="/older">
              <Button type="primary">Thanh toán</Button>
          </Link>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default CartsPage;
