import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { message, Skeleton, Card, Descriptions, Row, Col, Button } from 'antd';
import React, { useEffect } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  role: string;
  registerAt: string;
  changePassAt?: string;
};

const ProfilePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const loggedInEmail = storedUser ? JSON.parse(storedUser).email : null;

  useEffect(() => {
    if (!loggedInEmail) {
      messageApi.open({
        type: 'error',
        content: 'Vui lòng đăng nhập để xem thông tin cá nhân.',
      });
    }
  }, [loggedInEmail, messageApi]);

  const { data: users, isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await instance.get('/users');
      return response.data;
    },
    enabled: !!loggedInEmail,
  });

  const currentUser = users?.find(user => user.email.trim().toLowerCase() === loggedInEmail.trim().toLowerCase());

  if (isLoading) {
    return <Skeleton active avatar paragraph={{ rows: 4 }} />;
  }

  if (isError) {
    return <div>Lỗi khi tải thông tin người dùng: {error.message}</div>;
  }

  if (!currentUser) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-6">
      {contextHolder}
      <Card className="w-full max-w-2xl shadow-lg rounded-lg bg-white border border-gray-300">
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} sm={24}>
            <h2 className="text-xl font-semibold text-center mb-4">Thông tin cá nhân</h2>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">{currentUser.role}</Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {new Date(currentUser.registerAt).toLocaleDateString()}
              </Descriptions.Item>
              {currentUser.changePassAt && (
                <Descriptions.Item label="Thay đổi mật khẩu lần cuối">
                  {new Date(currentUser.changePassAt).toLocaleDateString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
        </Row>
        <div className="mt-6 flex justify-end">
          <Button type="primary" icon={<LockOutlined />} onClick={() => navigate(`/changepass/${currentUser.id}`)}>
            Đổi Mật Khẩu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
