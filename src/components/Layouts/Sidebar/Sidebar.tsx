import { HomeOutlined, ProductOutlined, ShoppingCartOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'



const Sidebar = () => {
return (
    <div className="min-h-screen w-64 bg-black text-white">
    <div className="p-4 text-center font-bold text-xl border-b border-gray-600">
        Admin Panel
    </div>
    <nav className="mt-10">
        <ul>
            <li className="px-4 py-2 hover:bg-slate-400">
                <HomeOutlined className='mr-2'/><Link to="/">Quay lại trang chủ</Link>
            </li>
            <li className="px-4 py-2 hover:bg-slate-400">
                <ProductOutlined className='mr-2'/><Link to="/admin/products">Quản lý sản phẩm</Link>
            </li>
            <li className="px-4 py-2 hover:bg-slate-400">
                <UserOutlined className='mr-2'/><Link to="/admin/accounts">Quản lý tài khoản</Link>
            </li>
            <li className="px-4 py-2 hover:bg-slate-400">
                <TagsOutlined className='mr-2'/><Link to="/admin/categories">Quản lý danh mục</Link>
            </li>
            <li className="px-4 py-2 hover:bg-slate-400">
                <ShoppingCartOutlined className='mr-2'/><Link to="/admin/olders">Quản lý đơn hàng</Link>
            </li>
        </ul>
    </nav>
</div>
        )
}

export default Sidebar