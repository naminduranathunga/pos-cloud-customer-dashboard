import { Button } from "@/components/ui/button";
import ProductCategory from "@/interfaces/product_category";
import {Save } from "lucide-react";

import { useCallback, useState } from "react";
import ProductEditor from "@/components/inventory/products/ProductEditor";
import { useParams } from "react-router-dom";


const initialProduct = {
    _id: "",
    name: "",
    sku: "",
    price: 0,
    category: {
        _id: "",
        name: ""
    },
    barcodes: [],
    description: ""
};

export default function ProductEditorPage() {
    const {productId} = useParams() as {productId?: string};

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">{ productId ? "Edit Product": "Create New Product"}</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={()=>{}}> <Save size={"1em"} /> Save</Button>
                
            </header>


            <div className="grid grid-cols-1 gap-6">
                <ProductEditor /> 
            </div>

        </div>
    )
}