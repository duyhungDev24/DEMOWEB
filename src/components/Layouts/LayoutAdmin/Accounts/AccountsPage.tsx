import instance from "@/configs/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    message,
    Popconfirm,
    Table,
    DatePicker,
    Input,
    Select,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const AccountsPage = () => {
const [messageApi, contextHolder] = message.useMessage();
const queryClient = useQueryClient();

const [searchTerm, setSearchTerm] = useState<string | null>(null);
const [selectedRole, setSelectedRole] = useState<string | null>(null);
const [selectedDateRange, setSelectedDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
>(null);

  // Fetch accounts
const { data, isLoading, isError } = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            return await instance.get("/users");
    },
});

const { mutate } = useMutation({
mutationFn: async (id: number) => {
    try {
        await instance.delete(`/users/${id}`);
    } catch (error) {
        throw new Error("Lỗi khi xóa tài khoản");
    }
},
onSuccess: () => {
    messageApi.open({
        type: "success",
        content: "Xóa thành công",
    });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
},
onError: () => {
    messageApi.open({
        type: "error",
        content: "Xóa thất bại",
    });
    },
});

const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
) => {
    setSelectedDateRange(dates);
};

const resetFilters = () => {
    setSearchTerm(null);
    setSelectedRole(null);
    setSelectedDateRange(null);
};

if (isLoading) return <div>Loading....</div>;
if (isError) return <div>Error....</div>;

const isDateInRange = (date: string) => {
    if (!selectedDateRange) return true;
    const [start, end] = selectedDateRange;
    const currentDate = dayjs(date);
    return (
        currentDate.isAfter(
        start?.startOf("day") || dayjs().startOf("day")?.subtract(1, "day")
    ) &&
        currentDate.isBefore(
            end?.endOf("day") || dayjs().endOf("day")?.add(1, "day")
    )
    );
};

const filteredData = data?.data.filter((account: any) => {
const matchesSearch = searchTerm
    ? account.email.toLowerCase().includes(searchTerm.toLowerCase())
    : true;
    const matchesRole = selectedRole ? account.role === selectedRole : true;
    const matchesDate = isDateInRange(account.registerAt);
    return matchesSearch && matchesRole && matchesDate;
});

const dataSource = filteredData?.map((account: any) => ({
    key: account.id,
    ...account,
}));

const columns = [
    {
        key: "id",
        title: "STT",
        dataIndex: "id",
    },
    {
        key: "email",
        title: "Email",
        dataIndex: "email",
    },
    {
        key: "role",
        title: "Vai trò",
        dataIndex: "role",
    },
    {
        key: "registerAt",
        title: "Ngày đăng ký",
        dataIndex: "registerAt",
        render: (registerAt: string) => {
        return registerAt
            ? dayjs(registerAt).format("DD/MM/YYYY")
            : "Ngày không hợp lệ";
        },
    },
    {
        key: 'changePassAt',
        title: 'Ngày thay đổi Cập nhật',
        dataIndex: 'changePassAt',
        render: (changePassAt: string) => {
            return changePassAt
                ? dayjs(changePassAt).format("DD/MM/YYYY")
                : "Ngày không hợp lệ";
            },
    },
    {
        key: "action",
        title: "Thao tác",
        dataIndex: "action",
        render: (_: any, account: any) => (
        <>
        <Popconfirm
            title="Xoá tài khoản"
            description="Bạn có chắc muốn xoá?"
            onConfirm={() => mutate(account.id || 0)}
        >
            <Button type="primary" danger>
                Xoá
            </Button>
        </Popconfirm>
        <Button type="primary">
            <Link to={`${account.id}/edit`}>Sửa</Link>
        </Button>
        </>
    ),
    },
];

return (
    <div className="flex flex-col">
        {contextHolder}
        <div className="flex justify-between items-center mt-6 mb-4">
        <h1 className="text-2xl font-sans ml-10">Danh sách tài khoản</h1>
        <Link to={`add`}>
            <Button
            className="mr-30 bg-black text-white"
            icon={<PlusCircleOutlined />}
        >
            Tạo tài khoản
            </Button>
        </Link>
    </div>

    <div className="flex gap-4 mb-4">
        <Input
            placeholder="Tìm kiếm theo email"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
        />
        <Select
            placeholder="Lọc theo vai trò"
            onChange={(value) => setSelectedRole(value)}
            className="w-1/3"
            value={selectedRole ?? ""}
            options={[
                { value: "", label: "Tất cả" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
        ]}
        />

        <RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
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

export default AccountsPage;
