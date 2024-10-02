import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import instance from '@/configs/axios';

type FieldType = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const mutation = useMutation<void, Error, FieldType>({
    mutationFn: async (passwordData: FieldType) => {
      const { email, newPassword } = passwordData;
      try {
        const response = await instance.get('/users');
        const users = response.data;
        const user = users.find((user: any) => user.email === email);
        if (user) {
          const response = await instance.patch(
            `/users/${user.id}`,
            {
              password: newPassword,
            }
          );
          return response.data;
        } else {
          throw new Error('Email không tồn tại!');
        }
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không đúng thông tin');
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Đổi mật khẩu thành công!',
      });
      form.resetFields();
      navigate('/');
    },
    onError: (error: Error) => {
      messageApi.open({
        type: 'error',
        content: error.message || 'Đổi mật khẩu thất bại!',
      });
    },
  });

  const handleForgotPassword = async (values: any) => {
    const email = values.email;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;
    if (newPassword !== confirmPassword) {
      messageApi.open({
        type: 'error',
        content: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
      });
      return;
    }
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {contextHolder}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Quên Mật Khẩu</h1>
        <Form
          form={form}
          name="forgot_password"
          layout="vertical"
          onFinish={handleForgotPassword}
          className="space-y-6"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email của bạn!' },
              { type: 'email', message: 'Cần Email hợp lệ' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Item>
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

          <Button
            type="primary"
            htmlType="submit"
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;