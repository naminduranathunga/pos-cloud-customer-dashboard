import ProductCategoryEditor from "@/components/inventory/category/ProductCategoryEditor";
import { Button } from "@/components/ui/button";
import ProductCategory from "@/interfaces/product_category";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/inventory/products/ProductTable";
import { Link } from "react-router-dom";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import config from "@/lib/config";
import { ProductSimple } from "@/interfaces/products";
import { useToast } from "@/components/ui/use-toast";
import LoadingProductTable from "@/components/inventory/products/LoadingProductTable";


async function get_product_list(jwt: string){
    const resp = await fetch(`${config.apiURL}/product-manager/products/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });

    if (resp.ok){
        const products = await resp.json();
        const list_products = products.map((product: any) => {
            return {
                id: product.id,
                name: product.name,
                price: (product.prices && product.prices.length > 0 ? product.prices[0] : 0),
                sku: product.sku,
                category: product.category,
                barcodes: product.barcodes,
            }
        });
        console.log(list_products);
        return list_products;
    } else if (resp.status === 401){
        throw new Error("Unauthorized");
    } else {
        try{
            const error = await resp.json();
            throw new Error(error.message);
        } catch {
            throw new Error("Failed to fetch products");
        }
    }
}

export default function ProductPage() {
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [toggleNewCategory, setToggleNewCategory] = useState<boolean>(false);
    const [product_list, setProductList] = useState<ProductSimple[] | null>(null); // ProductSimple[
    const {
        isLoading,
        user,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    const category: ProductCategory = {
        id: "",
        name: "",
        parent: null
    }

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);


    useEffect(()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;
        get_product_list(jwt).then((data)=>{
            setProductList(data);
            console.log(data);
        }).catch((error)=>{
            toast({
                title: "Error!",
                //message: error.message,
                variant:"destructive",
            })
            console.error(error);
        });
    }, [isLoading, get_user_jwt]);


    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Products</h1>

                <Link to={`/inventory/products/editor/`} className="flex items-center gap-2 ms-auto">
                    <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New Product</Button>
                </Link>
                <Input placeholder="Search category" value={search_term} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
                <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                    variant={"secondary"} 
                    onClick={tottleSearchFn}
                    title="Search category"> <Search size={"1em"} /></Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} className="hover:bg-green-900 hover:text-white transition"> <EllipsisVertical /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><FileUp size={"1em"} className="me-2" /> Import</DropdownMenuItem>
                        <DropdownMenuItem><FileDown size={"1em"} className="me-2" /> Export</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>


            <div className="grid grid-cols-1 gap-6">
                { product_list === null ? (<LoadingProductTable />)
                :
                <ProductTable searchTerm={search_term} product_list={product_list} /> }
                  
            </div>

            {toggleNewCategory && <ProductCategoryEditor category={category} category_list={[]} with_trigger={false} onClose={()=>{setToggleNewCategory(false)}} />}
        </div>
    )
}