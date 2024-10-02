import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, message, Select, Skeleton } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";

type FieldType = {
  role: string;
};

const AccountEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const [form] = useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await instance.get(`/users/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (user: FieldType) => {
      try {
        // Sử dụng PATCH thay vì PUT để chỉ cập nhật trường role
        return await instance.patch(`/users/${id}`, user);
      } catch (error) {
        throw new Error("Lỗi API");
      }
    },
    onSuccess: () => {
      messageApi.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
    onError: () => {
      messageApi.error("Cập nhật thất bại");
    },
  });

  // Xử lý form submit
  const onFinish = (values: FieldType) => {
    mutate(values);
  };

  if (isLoading) return <Skeleton />;
  if (isError) return <div>Error fetching data...</div>;

  return (
    <div>
      {contextHolder}
      <h2>Chỉnh sửa tài khoản</h2>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={data}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Role"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountEdit;
