import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CustomerInterface from "@/interfaces/inventory/customer";


export default function CustomerTable({customers, onEdit, onDelete}: {customers: CustomerInterface[], onEdit: (customer: CustomerInterface) => void, onDelete: (customer: CustomerInterface) => void}){
    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer: CustomerInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:text-primary hover:underline transition" onClick={()=>{onEdit(customer)}} >Edit</button>
                            <button className="text-red-500 hover:text-red-700 ms-4 hover:underline transition" onClick={()=>{onDelete(customer)}}>Delete</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}