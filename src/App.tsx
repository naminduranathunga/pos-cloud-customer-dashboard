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
import CompanyProfilePage from "./pages/company/CompanyProfilePage";
import useFlexaroUser from "./lib/hooks/flexaro_user";
import { useEffect, useState } from "react";
import config from "./lib/config";
import InventoryManagerLayout from "./pages/inventory/manager/InventoryManagerLayout";
import GRNTable from "./pages/inventory/manager/grn/GRN";
import CreateNewGRNPage from "./pages/inventory/manager/grn/newgrn";
import VendorListPage from "./pages/inventory/vendor/vendor_list_page";
import CustomerListPage from "./pages/inventory/customers/customers_list_page";
import GRNViewPage from "./pages/inventory/manager/grn/grnview_page";
import SubscriptionPage from "./pages/company/SubscriptionPage";
import SubscriptionInvoicePage from "./pages/company/InvoicePage";
import SubscriptionPaymentOptionsPage from "./pages/company/PaymentOptionsPage";


async function ValidateUser(get_user_jwt:Function) {
    const jwt = get_user_jwt();
    if (!jwt) {
		console.log("User is not valid");
        window.location.href = "/login?redirect=" + window.location.pathname;
		return false;
    }

    const response  = await fetch(`${config.apiURL}/user-manager/is_token_valid`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }});
    if (response.status === 401) {
		console.log("User is not valid");
        //window.location.href = "/login?redirect=" + window.location.pathname;
    } else {
        console.log("User is valid");
        return true;
    }
	return false;
}

function App() {
	const { get_user_jwt, isLoading } = useFlexaroUser();
	const [ isValidated , setIsValidated ] = useState(false);

    useEffect(() => {
		if (isValidated) return;
        if (isLoading) return;
		if (window.location.pathname === "/login") return;
        ValidateUser(get_user_jwt).then(
			(res) => {
				setIsValidated(res);
			}
		)
		
    }, [isLoading, get_user_jwt, isValidated]);

	useEffect(()=>{
		const onError = ()=>{
			if (window.location.pathname === "/login") return;
			//window.location.href = "/login?redirect=" + window.location.pathname;
		}
		document.addEventListener("flexaro_user_unauthorized", onError);
		return ()=>{
			document.removeEventListener("flexaro_user_unauthorized", onError);
		}
	}, []);

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
					<Route path="vendors" element={<VendorListPage />} />
					<Route path="customers" element={<CustomerListPage />} />
					<Route path="manager" element={<InventoryManagerLayout />} >
						<Route path="grn" element={<GRNTable />} />
						<Route path="grn/create" element={<CreateNewGRNPage />} />
						<Route path="grn/:grnId" element={<GRNViewPage />} />
						<Route path="*" element={<h1>Not Found</h1>} />
					</Route>
				</Route>

				<Route path="/users" element={<Outlet />}>
					<Route path="" element={<UserListPage />} />
					<Route path="roles" element={<UserRolesListPage />} />
					<Route path="roles/edit" element={<EditUserRolePage />} />
					<Route path="edit" element={<EditUserPage />} />
				</Route>

				<Route path="/company" element={<Outlet />}>
					<Route path="" element={<CompanyProfilePage />} />
					<Route path="subscriptions" element={<SubscriptionPage />} />
					<Route path="subscriptions/invoice/:invoiceId" element={<SubscriptionInvoicePage />} />
					<Route path="payment-options" element={<SubscriptionPaymentOptionsPage />} />
				</Route>


			</Route>
			<Route path="*" element={<h1>Not Found</h1>} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
