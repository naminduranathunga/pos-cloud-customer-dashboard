import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VendorInterface } from "@/interfaces/inventory/vendor";


export default function VendorTable({vendors, onEdit, onDelete}: {vendors: VendorInterface[], onEdit: (vendor: VendorInterface) => void, onDelete: (vendor: VendorInterface) => void}){
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
                {vendors.map((vendor: VendorInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell>{vendor.id}</TableCell>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.phone}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.address}</TableCell>
                        <TableCell>
                            <button className="text-blue-500 hover:text-primary hover:underline transition" onClick={()=>{onEdit(vendor)}} >Edit</button>
                            <button className="text-red-500 hover:text-red-700 ms-4 hover:underline transition" onClick={()=>{onDelete(vendor)}}>Delete</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}