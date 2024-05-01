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
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/inventory/products/ProductTable";

export default function ProductPage() {
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [toggleNewCategory, setToggleNewCategory] = useState<boolean>(false);

    const category: ProductCategory = {
        id: "",
        name: "",
        parent: null
    }

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);


    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Products</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={()=>{setToggleNewCategory(true)}}> <Plus size={"1em"} /> New Product</Button>
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
                <ProductTable searchTerm={search_term} />   
            </div>

            {toggleNewCategory && <ProductCategoryEditor category={category} category_list={[]} with_trigger={false} onClose={()=>{setToggleNewCategory(false)}} />}
        </div>
    )
}