import ProductCategoryEditor from "@/components/inventory/category/ProductCategoryEditor";
import ProductCategoryTable from "@/components/inventory/category/ProductCategoryTable";
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
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useToast } from "@/components/ui/use-toast";
import config from "@/lib/config";

async function fetchCategories(jwt:string): Promise<ProductCategory[]>{
    const resp = await fetch(`${config.apiURL}/product-manager/product-category/get?populate=1`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (resp.ok){
        const cats = await resp.json();
        const categories: ProductCategory[] = cats.map((cat: any) => {
            return {
                id: cat.id,
                name: cat.name,
                parent: (cat.parent_id? {id: cat.parent_id.id, name: cat.parent_id.name, parent: cat.parent_id.parent} : null)
            }
        });
        return categories;
    }else {
        if (resp.status === 401){
            throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch categories");
    }
}
    

export default function ProductCategoryPage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [toggleNewCategory, setToggleNewCategory] = useState<boolean>(false);
    const {toast} = useToast();
    const { get_user_jwt, isLoading } = useFlexaroUser();
    const [categories, setCategories] = useState<ProductCategory[]|null>(null);

    const category: ProductCategory = {
        id: "",
        name: "",
        parent: null
    }

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);

    const updateCategories = useCallback(()=>{
        const jwt_token = get_user_jwt() ?? "";
        fetchCategories(jwt_token).then((data)=>{
            setCategories(data);
        }).catch((error)=>{
            if (error.message === "Unauthorized"){
                toast({
                    title: "Unauthorized",
                    description: "You are not authorized to view this page.",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch categories.",
                    variant: "destructive"
                });
            }
        });
    }, [get_user_jwt, toast]);

    useEffect(()=>{
        if (isLoading) return;
        const jwt_token = get_user_jwt() ?? "";
        fetchCategories(jwt_token).then((data)=>{
            setCategories(data);
        }).catch((error)=>{
            if (error.message === "Unauthorized"){
                toast({
                    title: "Unauthorized",
                    description: "You are not authorized to view this page.",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch categories.",
                    variant: "destructive"
                });
            }
        });
    }, [get_user_jwt, isLoading, toast]);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Product Categories</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={()=>{setToggleNewCategory(true)}}> <Plus size={"1em"} /> New Category</Button>
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
                <ProductCategoryTable categories={categories} searchTerm={search_term} callback_update={updateCategories} />   
            </div>

            {toggleNewCategory && <ProductCategoryEditor category={category} category_list={categories??[]} with_trigger={false} onClose={()=>{setToggleNewCategory(false)}} onSave={(cat:any)=>{updateCategories(); setToggleNewCategory(false)}} />}
        </div>
    )
}