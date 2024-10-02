// src/pages/SignUpPage.tsx

import React from 'react';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { useNavigate } from 'react-router-dom';

type Props = {};

type FieldType = {
  email: string;
  password: string;
  name: string;
};

const SignUpPage: React.FC<Props> = () => {
  const [messageApi, contextHolder] = message.useMessage(); 
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const { mutate } = useMutation({
    mutationFn: async (user: FieldType) => {
      try {
        return await instance.post(`/register`, user);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error('Lỗi API');
      }
    },
    onSuccess: (response) => {
      messageApi.open({
        type: 'success',
        content: 'Đăng ký thành công! Vui lòng đăng nhập.'
      });
      setTimeout(() => navigate('/signin'), 1500);
    },
    onError: (error: Error) => {
      messageApi.open({
        type: 'error',
        content: error.message || 'Đăng ký thất bại!'
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
        <h1 className="text-2xl font-semibold mb-6 text-center">Đăng ký tài khoản</h1>
        <Form
          name="signup"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên của bạn!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" style={{ color: 'black' }} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email của bạn!' },
              { type: 'email', message: 'Cần Email hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" style={{ color: 'black' }} />
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
              <Form.Item name="agree" valuePropName="checked" noStyle>
                <Checkbox>Đồng ý với các điều khoản</Checkbox>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item>
            <Button block className='bg-black text-white' htmlType="submit">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
