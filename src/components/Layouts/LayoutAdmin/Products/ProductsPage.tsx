import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Table, DatePicker, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import instance from '@/configs/axios';

const { RangePicker } = DatePicker;

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  isHidden: boolean;
};

const ProductsPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await instance.get('/products');
      return response.data;
    },
    retry: 3,
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await instance.get('/categories');
      return response.data;
    },
    retry: 3,
  });

  // Mutation để xóa sản phẩm
  const { mutate } = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      try {
        await instance.delete(`/products/${id}`);
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Xóa thành công',
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      messageApi.open({
        type: 'error',
        content: error.message || 'Xóa thất bại',
      });
    },
  });

  const getCategoryName = (categoryId: number) => {
    const category = categoriesData?.find((cate) => cate.id === categoryId);
    return category?.name || 'Không xác định';
  };

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setSelectedDateRange(dates);
  };


  const resetFilters = () => {
    setSearchTerm(null);
    setSelectedCategory(null);
    setSelectedDateRange(null);
  };


  const isDateInRange = (date: string) => {
    console.log('Selected Date Range:', selectedDateRange); // Debug
    if (!selectedDateRange) return true;
    if (
      !Array.isArray(selectedDateRange) ||
      selectedDateRange.length !== 2
    )
      return true;
    const [start, end] = selectedDateRange;
    const currentDate = dayjs(date);
    return (
      currentDate.isAfter(start?.startOf('day') || dayjs().startOf('day').subtract(1, 'day')) &&
      currentDate.isBefore(end?.endOf('day') || dayjs().endOf('day').add(1, 'day'))
    );
  };

  // Lọc dữ liệu dựa trên các điều kiện
  const filteredData = productsData?.filter((product) => {
    const category = categoriesData?.find((cate) => cate.id === product.categoryId);

    const matchesSearch = searchTerm
      ? product.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;
    const matchesDate = isDateInRange(product.createdAt);
    const isCategoryVisible = category ? !category.isHidden : true;

    return matchesSearch && matchesCategory && matchesDate && isCategoryVisible;
  });

  const dataSource = filteredData?.map((product) => ({
    key: product.id,
    ...product,
  }));

  const columns = [
    {
      key: 'id',
      title: 'STT',
      dataIndex: 'id',
    },
    {
      key: 'title',
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      key: 'image',
      title: 'Ảnh sản phẩm',
      dataIndex: 'image',
      render: (image: string) => (
        <img src={image} alt="product" width={50} height={50} />
      ),
    },
    {
      key: 'price',
      title: 'Giá sản phẩm',
      dataIndex: 'price',
    },
    {
      key: 'description',
      title: 'Mô tả sản phẩm',
      dataIndex: 'description',
    },
    {
      key: 'quantity',
      title: 'Số lượng sản phẩm',
      dataIndex: 'quantity',
    },
    {
      key: 'createdAt',
      title: 'Ngày thêm',
      dataIndex: 'createdAt',
      render: (createdAt: string) =>
        createdAt ? dayjs(createdAt).format('DD/MM/YYYY') : 'Ngày không hợp lệ',
    },
    {
      key: 'categoryId',
      title: 'Danh mục sản phẩm',
      dataIndex: 'categoryId',
      render: (categoryId: number) => getCategoryName(categoryId),
    },
    {
      key: 'updatedAt',
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      render: (updatedAt: string) =>
        updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật',
    },
    {
      key: 'action',
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_: any, product: Product) => (
        <>
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn có chắc muốn xoá?"
            onConfirm={() => mutate(product.id)}
          >
            <Button type="primary" danger style={{ marginRight: 8 }}>
              Xoá
            </Button>
          </Popconfirm>
          <Button type="primary">
            <Link to={`${product.id}/edit`}>Sửa</Link>
          </Button>
        </>
      ),
    },
  ];

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Loading....</div>;
  }
  if (isErrorProducts || isErrorCategories) {
    return <div>Error....</div>;
  }

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h1 className="text-2xl font-sans ml-10">Danh sách sản phẩm</h1>
        <Link to={`add`}>
          <Button
            className="mr-30 bg-black text-white"
            icon={<PlusCircleOutlined />}
          >
            Tạo sản phẩm
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Select
          placeholder="Lọc theo danh mục"
          onChange={(value) => setSelectedCategory(value ? Number(value) : null)}
          className="w-1/3"
          value={selectedCategory ?? ''}
          allowClear
          options={[
            { value: null, label: 'Tất cả' },
            ...(categoriesData?.map((cate) => ({
              value: cate.id,
              label: cate.name,
            })) ?? []),
          ]}
        />

        <RangePicker
          placeholder={['Từ ngày', 'Đến ngày']}
          onChange={handleDateChange}
          className="w-1/3"
        />
        <Button onClick={resetFilters} className="ml-2">
          Reset lọc
        </Button>
      </div>

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ProductsPage;
