
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { ProductSimple } from "@/interfaces/products";
import config from "@/lib/config";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";


function getPriceStr(product: ProductSimple){
    if (product.max_price && product.min_price && product.max_price > 0 && product.min_price > 0 && product.max_price !== product.min_price){
        return `Rs. ${product.min_price} - Rs. ${product.max_price}`;
    } else if (product.price > 0){
        return `Rs. ${product.price}`;
    } else {
        return "-";
    }
}

export default function ProductTable({searchTerm, product_list}: {searchTerm?: string, product_list: ProductSimple[]}){

    
    var products = product_list;
    if (searchTerm){
        products = product_list.filter((product) => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
                    || product.sku.toLowerCase().includes(searchTerm.toLowerCase())
                        || (product.barcodes && product.barcodes.includes(searchTerm));
        });
    }


    const rows = products.map((product) => {
        return (
            <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell className="text-end">
                    {
                        product.thumbnail && <img src={`${config.apiURL}/product-manager/products/get-thumbnail?image_file=${product.thumbnail}`} alt={product.name} className="w-8 h-8 object-contain bg-gray-200" />
                    }
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{ getPriceStr(product) }</TableCell>
                <TableCell className="text-right">
                    <Link to={`/inventory/products/editor/${product.id}`} className="text-blue-500 hover:text-primary hover:underline transition flex  items-center gap-2 hover:text-green-600"><Pen size={"1em"}/> Edit</Link>
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
                        <TableHead></TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
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