// src/components/Layouts/LayoutAdmin/Categories/CategoriesPage.tsx

import { useState } from 'react';
import { PlusCircleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Table, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import instance from '@/configs/axios';

type Category = {
    id: number;
    name: string;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
};

const CategoriesPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Fetch categories
    const { data, isLoading, isError } = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await instance.get('/categories');
            return response.data;
        },
        retry: 3,
    });

    // Mutation để xóa danh mục
    const { mutate: deleteCategory } = useMutation<void, Error, number>({
        mutationFn: async (id: number) => {
            try {
                await instance.delete(`/categories/${id}`);
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Lỗi khi xóa danh mục');
            }
        },
        onSuccess: () => {
            messageApi.success('Xóa thành công');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            messageApi.error(error.message || 'Xóa thất bại');
        },
    });

    const { mutate: hideCategory } = useMutation<void, Error, number>({
        mutationFn: async (id: number) => {
            try {
                await instance.patch(`/categories/${id}`, { isHidden: true });
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Lỗi khi ẩn danh mục');
            }
        },
        onSuccess: () => {
            messageApi.success('Đã ẩn danh mục thành công');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            messageApi.error(error.message || 'Ẩn danh mục thất bại');
        },
    });

    // Mutation để hiển thị lại danh mục
    const { mutate: showCategory } = useMutation<void, Error, number>({
        mutationFn: async (id: number) => {
            try {
                await instance.patch(`/categories/${id}`, { isHidden: false });
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Lỗi khi hiển thị lại danh mục');
            }
        },
        onSuccess: () => {
            messageApi.success('Danh mục đã được hiển thị lại');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: Error) => {
            messageApi.error(error.message || 'Hiển thị lại danh mục thất bại');
        },
    });

    const dataSource = data?.map((cate: Category) => ({
        key: cate.id,
        ...cate
    })) || [];
    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
    };
    const filteredData = dataSource.filter((cate: Category) => {
        const matchesSearch = cate.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all'
            ? true
            : filterStatus === 'hidden'
                ? cate.isHidden
                : !cate.isHidden;
        return matchesSearch && matchesFilter;
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching categories...</div>;
    }

    // Cấu hình cột cho bảng
    const columns = [
        {
            key: 'id',
            title: 'STT',
            dataIndex: 'id'
        },
        {
            key: 'name',
            title: 'Tên danh mục',
            dataIndex: 'name'
        },
        {
            key: 'createdAt',
            title: 'Ngày thêm',
            dataIndex: 'createdAt',
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        },
        {
            key: 'action',
            title: 'Thao tác',
            render: (_: any, category: Category) => {
                return (
                    <>
                        <Popconfirm
                            title="Xoá danh mục"
                            description="Bạn có muốn xoá danh mục này?"
                            onConfirm={() => deleteCategory(category.id)}
                        >
                            <Button type='primary' className='mr-2' danger>Xoá</Button>
                        </Popconfirm>
                        {category.isHidden ? (
                            <Button type='default' onClick={() => showCategory(category.id)} icon={<EyeOutlined />}>
                                Hiển thị lại
                            </Button>
                        ) : (
                            <Button type='default' onClick={() => hideCategory(category.id)} icon={<EyeInvisibleOutlined />}>
                                Ẩn
                            </Button>
                        )}
                    </>
                );
            }
        }
    ];

    return (
        <div className="flex flex-col">
            {contextHolder}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-sans">Danh mục</h1>
                <Link to={`add`}>
                    <Button type="primary" icon={<PlusCircleOutlined />}>Thêm danh mục</Button>
                </Link>
            </div>
            <Input
                placeholder="Tìm kiếm danh mục"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <Select
                defaultValue="all"
                onChange={handleFilterChange}
                className="mb-4"
                allowClear
                options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'visible', label: 'Đang hiện' },
                    { value: 'hidden', label: 'Đang ẩn' },
                ]}
            />
            <Table dataSource={filteredData} columns={columns} />
        </div>
    );
};

export default CategoriesPage;
