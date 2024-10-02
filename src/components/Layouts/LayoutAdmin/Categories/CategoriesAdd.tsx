import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import {
    Button,
    Form,
    FormProps,
    Input,
    message,
} from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";



type FieldType = {
    name?: string;
};

const CategoriesAdd = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();


    const { mutate } = useMutation({
    mutationFn: async (cate: any) => {
        try {
            return await instance.post("/categories", cate);
        } catch (error) {
            throw new Error("Lỗi API");
        }
    },

    onSuccess: () => {
        messageApi.open({
            type: "success",
            content: "Thêm danh mục thành công",
        });
        form.resetFields();
    },

    onError: () => {
        messageApi.open({
            type: "error",
            content: "Thêm danh mục thất bại",
        });
    },
    });

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // Thêm trường createdAt với giá trị thời gian hiện tại
    const categoryWithTimestamp = {
        ...values,
        createdAt: new Date().toISOString(),
    };
    console.log("Success:", categoryWithTimestamp);
    mutate(categoryWithTimestamp);
};


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
            name="name"
            rules={[
                { required: true, message: "Cần nhập tên sản phẩm !" },
            ]}
            className="col-span-2"
            >
            <Input />
            </Form.Item>
          {/* Submit Button */}
            <Form.Item className="col-span-2">
                <Button
                className="bg-black text-white w-full mt-4"
                htmlType="submit"
            >
                    Submit
                </Button>
            </Form.Item>
        </Form>
        </div>
    </div>
    );
};

export default CategoriesAdd;
