// src/pages/ChangePass.tsx

import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Skeleton } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import instance from '@/configs/axios';

type FieldType = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePass: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await instance.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
  const mutation = useMutation<void, Error, FieldType>({
    mutationFn: async (passwordData: FieldType) => {
      const { newPassword, password: oldPassword } = passwordData;
      try {
        const response = await instance.patch(
          `/users/${id}`,
          {
            password: newPassword,
            oldPassword: oldPassword,
            changePassAt: new Date().toISOString(),
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Đổi mật khẩu thành công!',
      });
      form.resetFields();
      navigate('/profile');
    },
    onError: (error: Error) => {
      messageApi.open({
        type: 'error',
        content: error.message || 'Đổi mật khẩu thất bại!',
      });
    },
  });

  const onFinish = async (values: FieldType) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.open({
        type: 'error',
        content: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
      });
      return;
    }

    mutation.mutate(values);
  };

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Skeleton active />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">Error fetching user data...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {contextHolder}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Đổi Mật Khẩu</h1>
        <Form
          form={form}
          name="change_password"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {/* Mật khẩu cũ */}
          <Form.Item
            label="Mật khẩu cũ"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu cũ"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Item>

          {/* Mật khẩu mới */}
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Item>

          {/* Xác nhận mật khẩu mới */}
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Item>

          {/* Nút Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePass;
