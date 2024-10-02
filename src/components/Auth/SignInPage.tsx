// src/pages/LoginPage.tsx

import React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { useNavigate } from 'react-router-dom';

type Props = {};

type FieldType = {
  email: string;
  password: string;
};

const SignInPage: React.FC<Props> = () => {
  const [messageApi, contextHolder] = message.useMessage(); 
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const { mutate } = useMutation({
    mutationFn: async (credentials: FieldType) => {
      try {
        return await instance.post(`/login`, credentials); // Sử dụng /login thông qua proxy
      } catch (error: any) { // Sử dụng `any` để lấy thông tin chi tiết lỗi
        if (error.response && error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error('Lỗi API');
      }
    },
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      console.log('Received Token:', accessToken);
      console.log('Received User:', user);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', user.email);
      messageApi.open({
        type: 'success',
        content: 'Đăng nhập thành công!'
      });
      setTimeout(() => navigate('/profile'), 1500);
    },
    onError: (error: Error) => {
      messageApi.open({
        type: 'error',
        content: error.message || 'Đăng nhập thất bại!'
      });
    }
  });

  const onFinish = (values: FieldType) => {
    console.log('Success:', values);
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      {contextHolder}
      <div className="bg-white p-8 rounded-lg shadow-lg" style={{ maxWidth: 400, width: '100%' }}>
        <h1 className="text-2xl font-semibold mb-6 text-center">Đăng nhập tài khoản</h1>
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email của bạn!' },
              { type: 'email', message: 'Cần Email hợp lệ' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" style={{ color: 'black' }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Cần mật khẩu từ 6 ký tự trở lên!' }
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" style={{ color: 'black' }} />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Nhớ tôi</Checkbox>
              </Form.Item>
              <a href="/forgotpass" className="text-sky-400 hover:underline">Quên mật khẩu?</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button block className='bg-black text-white' htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;
