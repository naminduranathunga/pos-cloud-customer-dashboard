
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { CompanyBranch } from "@/interfaces/company";
import config from "@/lib/config";
import get_selected_branch, { remove_branch_selection } from "@/lib/get_selected_branch";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface GRN {
    id: number;
    grn_number: number;
    supplier: string;
    date: string;
    total: number;
    status: "draft" | "completed" | "cancelled";
};



function convert_date(date: string){
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function formatCurrency(value: number){
    return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
}

export default function GRNTable(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [grn_list, setGrnList] = useState<GRN[]|null>(null);
    const {get_user_jwt, isLoading} = useFlexaroUser();

    useEffect(()=>{
        if (grn_list !== null) return;
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (jwt === null) return;

        const branch = get_selected_branch() as CompanyBranch|null;
        if (!branch){
            return;
        }

        fetch(`${config.apiURL}/inventory-manager/grn/get?branch_id=${branch._id}`, {
            headers:{
                "Authorization": `Bearer ${jwt}`,
            }
        }).then((res)=>{
            if (res.ok){
                return res.json();
            }else {
                if (res.status === 400) {
                    // might be invalid branch id
                    remove_branch_selection();
                    toast({
                        title: "Error loading GRN list",
                        description: "Please try reloading the page",
                        variant: "destructive"
                    });
                }
                throw new Error("Error getting GRN list");
            }
        }).then((jsn)=>{
            setGrnList(jsn as GRN[]);
        }).catch((err)=>{
            console.error(err);
        });
        // fetch GRN list
    }, [get_user_jwt, isLoading]);
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
                            grn_list ? grn_list.map((grn: any) => {
                                return (
                                    <TableRow key={grn.id}>
                                        <TableCell>{grn.grn_no}</TableCell>
                                        <TableCell>{convert_date(grn.grn_date)}</TableCell>
                                        <TableCell>{formatCurrency(parseFloat(grn.total_amount))}</TableCell>
                                        <TableCell>{grn.vendor_name}</TableCell>
                                        <TableCell>
                                            <Link to={`/inventory/manager/grn/${grn.id}`} className="flex items-center gap-2">
                                                <Button variant={"secondary"} size={"sm"}>View</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            }):
                            (
                               [...Array(5)] .map((_, i)=>
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-28"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28"/></TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}