
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import ProductCategory from "@/interfaces/product_category";
import { useEffect, useState } from "react";
import ProductCategoryEditor from "./ProductCategoryEditor";


export default function ProductCategoryTable({searchTerm}: {searchTerm?: string}){
    const [showEditor, setShowEditor] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

    const categories_ : ProductCategory[] = [
        {
            id: "1",
            name: "Electronics",
            parent: null
        },
        {
            id: "2",
            name: "Mobile",
            parent: {
                id: "1",
                name: "Electronics",
                parent: null
            }
        },
        {
            id: "3",
            name: "Laptop",
            parent: {
                id: "1",
                name: "Electronics",
                parent: null
            }
        },
        {
            id: "4",
            name: "Fashion 2",
            parent: null
        }
    ];
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    useEffect(()=>{
        if (!searchTerm) return setCategories(categories_);
        const filtered = categories_.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setCategories(filtered);
    }, [searchTerm, categories_]);

    const rows = categories.map((category) => {
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
                    category_list={categories} 
                    with_trigger={false} 
                    onSave={()=>{/**update the list */}} 
                    onClose={()=>setShowEditor(false)} /> }
        </div>
    )
}