import ProductCategoryEditor from "@/components/inventory/category/ProductCategoryEditor";
import ProductCategoryTable from "@/components/inventory/category/ProductCategoryTable";
import { Button } from "@/components/ui/button";
import ProductCategory from "@/interfaces/product_category";
import { FileDown, FileUp, Plus } from "lucide-react";


export default function ProductCategoryPage(){
    const category: ProductCategory = {
        id: "1",
        name: "Electronics",
        parent: null
    }

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Product Categories</h1>

                <Button className="flex items-center gap-2 ms-auto"> <Plus size={"1em"} /> New Category</Button>
                <Button variant={"secondary"} className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition"> <FileUp size={"1em"} /> Import</Button>
                <Button variant={"secondary"} className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition"> <FileDown size={"1em"} /> Export</Button>
            </header>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductCategoryTable />   
                <ProductCategoryEditor category={category} category_list={[]}  />             
            </div>
        </div>
    )
}