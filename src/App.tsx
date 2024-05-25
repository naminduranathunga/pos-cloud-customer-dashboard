import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import PageLayout from "./pages/Layout";
import Dashboard from "./pages/dashboard/dashboard";
import ProductCategoryPage from "./pages/inventory/category/product_category_pages";
import ProductPage from "./pages/inventory/products/product_page";
import ProductEditorPage from "./pages/inventory/products/product_editor_page";
import UserListPage from "./pages/users/user_list_page";
import UserRolesListPage from "./pages/users/roles/user_roles_page";
import EditUserRolePage from "./pages/users/roles/edit_user_role_page";
import EditUserPage from "./pages/users/user_editor_page";

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/" element={<PageLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />

				<Route path="/inventory" element={<Outlet />}>
					<Route path="products" element={<Outlet />} >
						<Route path="" element={<ProductPage />} />
						<Route path="editor/:productId?" element={<ProductEditorPage />} />
					</Route>
					<Route path="categories" element={<ProductCategoryPage />} />
				</Route>

				<Route path="/users" element={<Outlet />}>
					<Route path="" element={<UserListPage />} />
					<Route path="roles" element={<UserRolesListPage />} />
					<Route path="roles/edit" element={<EditUserRolePage />} />
					<Route path="edit" element={<EditUserPage />} />
				</Route>


			</Route>
			<Route path="*" element={<h1>Not Found</h1>} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
