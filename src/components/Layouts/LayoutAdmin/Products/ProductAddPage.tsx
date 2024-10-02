import instance from "@/configs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, InputNumber, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";



type FieldType = {
  title?: string;
  price?: string;
  image?: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
};

const ProductAddPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await instance.get("/categories"),
  });

  const { mutate } = useMutation({
    mutationFn: async (product: any) => {
      try {
        return await instance.post("/products", product);
      } catch (error) {
        throw new Error("Lỗi API");
      }
    },

    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm sản phẩm thành công",
      });
      form.resetFields();
    },

    onError: () => {
      messageApi.open({
        type: "error",
        content: "Thêm sản phẩm thất bại",
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // Thêm trường createdAt với giá trị thời gian hiện tại
    const productWithTimestamp = {
      ...values,
      createdAt: new Date().toISOString(),
    };
    console.log("Success:", productWithTimestamp);
    mutate(productWithTimestamp);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-screen px-4">
      {contextHolder}
      {/* Header section with h1 and button aligned to the left and right */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-3xl font-bold">Thêm mới sản phẩm</h1>
        <Button className="bg-black text-white" icon={<LeftCircleOutlined />}>
          <Link to={"/admin/products"}>Quay về trang sản phẩm</Link>
        </Button>
      </div>

      {/* Form Section */}
      <div className="flex justify-center mt-6">
        <Form
          form={form}
          name="basic"
          className="w-full max-w-xl grid grid-cols-2 gap-6"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Tên sản phẩm */}
          <Form.Item<FieldType>
            label="Tên sản phẩm"
            name="title"
            rules={[
              { required: true, message: "Cần nhập tên sản phẩm !" },
              { min: 10, message: "Tên sản phẩm phải nhiều hơn 10 ký tự !" },
            ]}
            className="col-span-2"
          >
            <Input />
          </Form.Item>

          {/* Giá sản phẩm */}
          <Form.Item<FieldType>
            label="Giá sản phẩm"
            name="price"
            rules={[
              { required: true, message: "Cần nhập giá sản phẩm !!" },
              { type: "number", min: 0, message: "Giá sản phẩm phải là số nguyên dương !" },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          {/* Danh mục */}
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Cần chọn danh mục" }]}
          >
            <Select
              className="w-full"
              options={categoriesData?.data.map((cate: any) => ({
                value: cate.id,
                label: cate.name,
              }))}
            />
          </Form.Item>

          {/* Hình ảnh */}
          <Form.Item
            label="Hình ảnh"
            name="image"
            className="col-span-2"
          >
            <Input />
          </Form.Item>
          
          {/*Số lượng */}
          <FormItem
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Cần nhập lượng sản phẩm !" },
                    { type: "number", min: 0, message: "Số lưới phải là số nguyên dướng !" },
            ]}
            className="col-span-2"
          >
            <InputNumber className="w-full"/>
          </FormItem>

          {/* Mô tả sản phẩm */}
          <Form.Item<FieldType>
            label="Mô tả sản phẩm"
            name="description"
            className="col-span-2"
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="col-span-2">
            <Button className="bg-black text-white w-full mt-4" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProductAddPage;
