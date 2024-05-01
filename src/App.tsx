import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import PageLayout from "./pages/Layout";
import Dashboard from "./pages/dashboard/dashboard";
import ProductCategoryPage from "./pages/inventory/category/product_category_pages";

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/" element={<PageLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />

				<Route path="/inventory" element={<Outlet />}>
					<Route path="categories" element={<ProductCategoryPage />} />
				</Route>

				<Route path="/users" element={<Outlet />}>
				</Route>
			</Route>
		</Routes>
    </BrowserRouter>
  );
}

export default App;
