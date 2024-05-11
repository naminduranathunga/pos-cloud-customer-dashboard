
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import ProductCategory from "@/interfaces/product_category";
import { useState } from "react";
import ProductCategoryEditor from "./ProductCategoryEditor";



export default function ProductCategoryTable({categories, searchTerm, callback_update}: {categories:ProductCategory[] | null, searchTerm?: string, callback_update: () => void}){
    const [showEditor, setShowEditor] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
    
    let categories_;
    if (searchTerm && categories){
        const categories_ = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }else{
        categories_ = categories;
    }

    let rows;
    if (categories_){
        rows = categories_.map((category) => {
            return (
                <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.parent?.name || "-"}</TableCell>
                    <TableCell className="text-right">
                        <button className="text-blue-500 hover:text-primary hover:underline transition"
                            onClick={(e)=>{setEditingCategory(category);setShowEditor(true)}}
                            >Edit</button>
                    </TableCell>
                </TableRow>
            )
        });
    } else {
        // rows are loading
        rows = (
            <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
            </TableRow>
        );
    }

    return (
        <div>
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>

            <div className="flex justify-center">

            </div>

            { showEditor && <ProductCategoryEditor 
                    category={editingCategory!} 
                    category_list={categories??[]} 
                    with_trigger={false} 
                    onSave={()=>{callback_update()}} 
                    onClose={()=>setShowEditor(false)} /> }
        </div>
    )
}