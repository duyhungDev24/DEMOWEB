import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Table, DatePicker, Button } from "antd";
import { Key, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const OldersList = () => {
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  // Fetch danh sách đơn hàng
  const { data, isLoading, isError } = useQuery({
    queryKey: ["olders"],
    queryFn: async () => {
      const response = await instance.get("/olders");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  // Lọc dữ liệu theo khoảng thời gian đã chọn
  const filteredData = data?.filter((order: any) => {
    if (!selectedDates) return true;
    const orderDate = dayjs(order.olderTime);
    const [startDate, endDate] = selectedDates;
    return orderDate.isBetween(startDate, endDate, "day", "[]");
  });

  const columns = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "name",
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      key: "phone",
      title: "SDT",
      dataIndex: "phone",
    },
    {
      key: "address",
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      key: "paymentMethod",
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
    },
    {
      key: "olderTime",
      title: "Thời gian mua hàng",
      dataIndex: "olderTime",
      render: (text: string | number | Date) => new Date(text).toLocaleString(),
    },
    {
      key: "product",
      title: "Sản phẩm",
      dataIndex: "products",
      render: (products: any[]) =>
        products
          .map(
            (product: { title: any; quantity: any }) =>
              `${product.title} (x${product.quantity})`
          )
          .join(", "),
    },
    {
      key: "images",
      title: "Hình ảnh",
      dataIndex: "products",
      render: (products: any[]) => (
        <div>
          {products.map(
            (product: {
              productId: Key | null | undefined;
              image: string | undefined;
              title: string | undefined;
            }) => (
              <img
                key={product.productId}
                src={product.image}
                alt={product.title}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
            )
          )}
        </div>
      ),
    },
    {
      key: "total",
      title: "Tổng tiền",
      dataIndex: "products",
      render: (products: any[]) => {
        const total = products.reduce(
          (sum: number, product: { price: number; quantity: number }) =>
            sum + product.price * product.quantity,
          0
        );
        return `${total.toLocaleString()} VNĐ`;
      },
    },
  ];

  const dataSource = filteredData?.map((order: any) => ({
    key: order.id,
    ...order,
  }));

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedDates(dates);
  };

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>

      {/* Bộ lọc thời gian */}
      <div style={{ marginBottom: 16 }}>
        <RangePicker onChange={handleDateChange} />
        <Button
          onClick={() => setSelectedDates(null)}
          style={{ marginLeft: 8 }}
        >
          Bỏ lọc
        </Button>
      </div>

      {/* Bảng hiển thị đơn hàng */}
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default OldersList;
