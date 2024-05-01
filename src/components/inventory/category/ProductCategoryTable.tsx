
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import ProductCategory from "@/interfaces/product_category";


export default function ProductCategoryTable(){
    const categories : ProductCategory[] = [
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
            name: "Fashion",
            parent: null
        }
    ];

    const rows = categories.map((category) => {
        return (
            <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parent?.name || "-"}</TableCell>
                <TableCell className="text-right">
                    <button className="text-blue-500 hover:text-primary hover:underline transition">Edit</button>
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
        </div>
    )
}