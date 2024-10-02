// src/components/Orders/OrdersPage.tsx

import { useEffect, useState } from 'react';
import instance from '@/configs/axios';
import { Table, message } from 'antd';

interface Order {
  id: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  customer: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  totalPrice: number;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          messageApi.error('Không tìm thấy thông tin người dùng.');
          return;
        }

        const response = await instance.get(`/orders?customer.email=${userEmail}`);
        setOrders(response.data);
      } catch (error) {
        messageApi.error('Đã xảy ra lỗi khi lấy đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [messageApi]);

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên Khách Hàng',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: ['customer', 'address'],
      key: 'address',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: ['customer', 'phone'],
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: ['customer', 'email'],
      key: 'email',
    },
    {
      title: 'Tổng Giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `${(price / 1000).toFixed(2)}k`,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-4">Đơn Hàng Của Bạn</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OrdersPage;
