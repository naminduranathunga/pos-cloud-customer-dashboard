
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


export default function ProductTable({searchTerm}: {searchTerm?: string}){

    const product_list : ProductSimple[] = [
        {
            id: "1",
            name: "Mobile",
            price: 1000,
            sku: "SKU-001",
            category: "Electronics"
        },
        {
            id: "2",
            name: "Laptop",
            price: 2000,
            sku: "SKU-002",
            category: "Electronics"
        },
        {
            id: "3",
            name: "Shirt",
            price: 20,
            sku: "SKU-003",
            category: "Fashion"
        },
        {
            id: "4",
            name: "T-Shirt",
            price: 10,
            sku: "SKU-004",
            category: "Fashion"
        }
    ];
    const [products, setProducts] = useState<ProductSimple[]>([]);

    useEffect(()=>{
        if (!searchTerm) return setProducts(product_list);
        const filtered = product_list.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setProducts(filtered);
    }, [searchTerm, products, product_list]);

    const rows = products.map((product) => {
        return (
            <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell className="text-right">
                    <Link to={`/inventory/products/editor/${product.id}`} className="text-blue-500 hover:text-primary hover:underline transition">Edit</Link>
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