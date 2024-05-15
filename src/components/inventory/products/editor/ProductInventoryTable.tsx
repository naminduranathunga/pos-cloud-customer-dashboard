import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function ProductEditorInventorySummary() {
    const inventory_summery = [
        {
            id: 1,
            date: "2021-10-10",
            sales_price: 100,
            cost_price: 80,
            stock: 100

        },
        {
            id: 2,
            date: "2021-10-10",
            sales_price: 100,
            cost_price: 80,
            stock: 100

        },
        {
            id: 3,
            date: "2021-10-10",
            sales_price: 100,
            cost_price: 80,
            stock: 100

        },
        {
            id: 4,
            date: "2021-10-10",
            sales_price: 100,
            cost_price: 80,
            stock: 100

        },
        {
            id: 5,
            date: "2021-10-10",
            sales_price: 100,
            cost_price: 80,
            stock: 100

        },
    ]


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sales Price</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Stock</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {inventory_summery.map((inventory) => (
                    <TableRow key={inventory.id}>
                        <TableCell>
                            {inventory.id}
                        </TableCell>
                        <TableCell>
                            {inventory.date}
                        </TableCell>
                        <TableCell>
                            {inventory.sales_price}
                        </TableCell>
                        <TableCell>
                            {inventory.cost_price}
                        </TableCell>
                        <TableCell>
                            {inventory.stock}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}