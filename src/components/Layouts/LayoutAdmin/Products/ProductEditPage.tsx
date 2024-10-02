import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, InputNumber, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { LeftCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";



type FieldType = {
  title?: string;
  price?: number;
  image?: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

const ProductEditPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { id } = useParams(); // Lấy id từ URL
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await instance.get('/categories'),
  });

  // Fetch product details by id
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await instance.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (productData) {
      form.setFieldsValue(productData);
    }
  }, [productData, form]);

  const { mutateAsync } = useMutation({
    mutationFn: async (product: FieldType) => {
      try {
        return await instance.put(`/products/${id}`, product);
      } catch (error) {
        throw new Error("Lỗi API");
      }
    },

    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Sửa sản phẩm thành công",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: () => {
      messageApi.open({
        type: "error",
        content: "Sửa sản phẩm thất bại",
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      // Lấy dữ liệu sản phẩm hiện tại để giữ nguyên `createdAt`
      const existingProductResponse = await instance.get(`/products/${id}`);
      const existingProduct = existingProductResponse.data;

      const productWithTimestamp = {
        ...existingProduct,
        ...values,
        updatedAt: new Date().toISOString(),
      };

      await mutateAsync(productWithTimestamp);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Lỗi khi cập nhật sản phẩm: " + (error as Error).message,
      });
    }
  };

  if (isCategoriesLoading || isProductLoading) return <div>Loading...</div>;
  if (isCategoriesError || isProductError) return <div>Error loading data</div>;

  return (
    <div className="min-h-screen px-4">
      {contextHolder}
      {/* Header section */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-3xl font-bold">Sửa sản phẩm : {productData?.title}</h1>
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
          
          {/* Số lượng */}
          <FormItem
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Cần nhập lượng sản phẩm !" },
                    { type: "number", min: 0, message: "Số lượng phải là số nguyên dương !" },
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

export default ProductEditPage;
