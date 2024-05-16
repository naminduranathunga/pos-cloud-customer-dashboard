
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { ProductSimple } from "@/interfaces/products";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function ProductTable({searchTerm, product_list}: {searchTerm?: string, product_list: ProductSimple[]}){

    
    var products = product_list;
    if (searchTerm){
        products = product_list.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }


    const rows = products.map((product) => {
        return (
            <TableRow key={product._id}>
                <TableCell className="font-medium">{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell className="text-right">
                    <Link to={`/inventory/products/editor/${product._id}`} className="text-blue-500 hover:text-primary hover:underline transition">Edit</Link>
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
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>

            <div className="flex justify-center">

            </div>
        </div>
    )
}