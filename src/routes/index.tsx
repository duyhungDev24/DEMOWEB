import { Route, Routes } from 'react-router-dom';

// Import các trang và layout
import Changepass from "@/components/Auth/ChangePass";
import SignInPage from "@/components/Auth/SignInPage";
import SignUpPage from "@/components/Auth/SignUpPage";
import AccountsPage from "@/components/Layouts/LayoutAdmin/Accounts/AccountsPage";
import CategoryAddPage from "@/components/Layouts/LayoutAdmin/Categories/CategoriesAdd";
import CategoriesPage from "@/components/Layouts/LayoutAdmin/Categories/CategoriesPage";
import LayoutAdmin from "@/components/Layouts/LayoutAdmin/LayoutAdmin";
import ProductAddPage from "@/components/Layouts/LayoutAdmin/Products/ProductAddPage";
import ProductEditPage from "@/components/Layouts/LayoutAdmin/Products/ProductEditPage";
import ProductsPage from "@/components/Layouts/LayoutAdmin/Products/ProductsPage";
import AboutPages from "@/components/Layouts/LayoutClient/AboutPages";
import HomePage from "@/components/Layouts/LayoutClient/HomePage";
import Layouts from "@/components/Layouts/LayoutClient/Layouts";
import SearchResults from '@/components/Layouts/LayoutClient/SearchResult';
import FavoritePage from '@/components/Layouts/LayoutClient/FavoritePage';
import ProfilePage from '@/components/Auth/ProfilePage';
import ProductsList from '@/components/Layouts/LayoutClient/ProductsList';
import ProductDetail from '@/components/Layouts/LayoutClient/ProductDetail';
import CartsPage from '@/components/Layouts/LayoutClient/Carts/CartsPage';
import OrderPage from '@/components/Older/Older';
import OldersList from '@/components/Layouts/LayoutAdmin/Olders/OldersList';
import AccountEdit from '@/components/Layouts/LayoutAdmin/Accounts/AccountEdit';
import ForgotPassword from '@/components/Auth/ForgotPass';






const Router = () => {

  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="about" element={<AboutPages />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="changepass/:id" element={<Changepass />} />
        <Route path='forgotpass' element={<ForgotPassword/>} />
        <Route path="productslist" element={<ProductsList/>} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/favorites' element={<FavoritePage />} />
        <Route path='/product/:id' element={<ProductDetail/>} />
        <Route path='/:id/carts' element={<CartsPage/>}  />
        <Route path='/older' element={<OrderPage/>} />
      </Route>
        <Route path="admin" element={<LayoutAdmin />}>
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<ProductAddPage />} />
          <Route path="products/:id/edit" element={<ProductEditPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/add" element={<CategoryAddPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="accounts/:id/edit" element={<AccountEdit/>} />
          <Route path='olders' element={<OldersList/>} />
        </Route>
    </Routes>
  );
};

export default Router;
