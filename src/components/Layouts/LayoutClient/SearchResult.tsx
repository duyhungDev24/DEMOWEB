import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import instance from "@/configs/axios";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const getSearchQueryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("query") || "";
  };

  useEffect(() => {
    const query = getSearchQueryFromURL();
    setSearchQuery(query);
    const fetchProducts = async () => {
      try {
        const response = await instance.get("/products");
        const allProducts = response.data;

        // Lọc sản phẩm theo query tìm kiếm
        const filtered = allProducts.filter((product: any) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [location.search]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho: "{searchQuery}"
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={product.image}
                alt={product.title}
                className="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;"
              />

              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-700 mb-4">Giá: {product.price} VND</p>
              <a
                href={`/product/${product.id}`}
                className="text-blue-500 hover:underline"
              >
                Xem chi tiết
              </a>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
