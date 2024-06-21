
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface GRN {
    id: number;
    grn_number: number;
    supplier: string;
    date: string;
    total: number;
    status: "draft" | "completed" | "cancelled";
};


const dummy_grn: GRN[] = [
    {
        id: 1,
        grn_number: 1234,
        supplier: "Supplier 1",
        date: "2022-01-01",
        total: 1000,
        status: "completed"
    },
    {
        id: 2,
        grn_number: 1235,
        supplier: "Supplier 2",
        date: "2022-01-02",
        total: 2000,
        status: "draft"
    },
    {
        id: 3,
        grn_number: 1236,
        supplier: "Supplier 3",
        date: "2022-01-03",
        total: 3000,
        status: "completed"
    },
];


export default function GRNTable(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">
                    Good Received Notes
                </h1>

                <Link to={`/inventory/manager/grn/create`} className="flex items-center gap-2 ms-auto">
                    <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New GRN</Button>
                </Link>
                <Input placeholder="Search category" value={"search_term"} onChange={(e) =>{}} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
                <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                    variant={"secondary"} 
                    onClick={()=>{}}
                    title="Search category"> <Search size={"1em"} /></Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} className="hover:bg-green-900 hover:text-white transition"> <EllipsisVertical /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><FileUp size={"1em"} className="me-2" /> Import</DropdownMenuItem>
                        <DropdownMenuItem><FileDown size={"1em"} className="me-2" /> Export</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>


            <div className="grid grid-cols-1 gap-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>GRN No.</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            dummy_grn.map((grn) => {
                                return (
                                    <TableRow key={grn.id}>
                                        <TableCell>{grn.grn_number}</TableCell>
                                        <TableCell>{grn.date}</TableCell>
                                        <TableCell>{grn.status}</TableCell>
                                        <TableCell>{grn.supplier}</TableCell>
                                        <TableCell>
                                            <Link to={`/inventory/manager/grn/${grn.id}`} className="flex items-center gap-2">
                                                <Button variant={"secondary"} size={"sm"}>View</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}