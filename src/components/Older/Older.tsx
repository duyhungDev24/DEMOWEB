import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Skeleton, Form, Input, Select } from "antd";
import instance from "@/configs/axios";

import { useForm } from "antd/es/form/Form";

type Order = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  userId: number;
  products: {
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  olderTime: string;
};

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

const OrderPage = () => {
  const [form] = useForm();
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

  const { mutateAsync: placeOrderAsync } = useMutation({
    mutationFn: async (orderInfo: Order) => {
      const response = await instance.post("/olders", orderInfo);
      return response.data;
    },
    onSuccess: async () => {
      message.success("Đặt hàng thành công");
      const cartId = data?.find((cart) => cart.userId === userId)?.id;
      if (cartId) {
        await instance.delete(`/carts/${cartId}`);
        message.success("Giỏ hàng đã được xóa");
      }

      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Đặt hàng thất bại");
    },
  });

  const handlePlaceOrder = async (values: any) => {
    const cartId = data?.find((cart) => cart.userId === userId)?.id;
    if (cartId) {
      const response = await instance.get(`/carts/${cartId}`);
      const cart = response.data;
      const orderInfo: Order = {
        name: values.name,
        phone: values.phone,
        address: values.address,
        paymentMethod: values.paymentMethod,
        userId: userId,
        products: cart.products,
        olderTime: new Date().toISOString(),
      };
      await placeOrderAsync(orderInfo);
    } else {
      message.error("Không tìm thấy giỏ hàng");
    }
  };

  if (isLoading) return <div><Skeleton active /></div>;
  if (isError) return <div>Error...</div>;

  return (
    <div className="container mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Đặt hàng</h1>
      <Form form={form} onFinish={handlePlaceOrder}>
        <Form.Item
          name="name"
          label="Tên người nhận"
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="paymentMethod"
          label="Phương thức thanh toán"
          rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
        >
          <Select>
            <Select.Option value="bankTransfer">Chuyển khoản ngân hàng</Select.Option>
            <Select.Option value="cashOnDelivery">Thanh toán khi nhận hàng</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Đặt hàng
        </Button>
      </Form>
    </div>
  );
};

export default OrderPage;
