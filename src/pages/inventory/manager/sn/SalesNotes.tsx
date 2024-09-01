
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
import DeleteIcon from '@/assets/icons/delete.png';

interface SalesNoteMini {
    id: number;
    sales_note_no: string;
    customer_id: number|null;
    customer_name: string|null;
    sale_date: string;
    total_amount: number;
    discount: number;
    adjustment:number;
    tax: number;
    delivery_fee: number;
    status: string;
};



function convert_date(date: string){
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function formatCurrency(value: number){
    return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
}

export default function SalesNotes(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [sn_list, setSnList] = useState<SalesNoteMini[]|null>(null);
    const {get_user_jwt, isLoading} = useFlexaroUser();

    useEffect(()=>{
        if (sn_list !== null) return;
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (jwt === null) return;

        const branch = get_selected_branch() as CompanyBranch|null;
        if (!branch){
            return;
        }

        fetch(`${config.apiURL}/inventory-manager/sn/get?branch_id=${branch._id}`, {
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
                        title: "Error loading Sales list",
                        description: "Please try reloading the page",
                        variant: "destructive"
                    });
                }
                throw new Error("Error getting SN list");
            }
        }).then((jsn)=>{
            setSnList(jsn as SalesNoteMini[]);
        }).catch((err)=>{
            console.error(err);
        });
        // fetch GRN list
    }, [get_user_jwt, isLoading, sn_list]);
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">
                    Sales Notes
                </h1>

                <Link to={`/inventory/manager/sn/create`} className="flex items-center gap-2 ms-auto">
                    <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New Sales Note</Button>
                </Link>
                <Input placeholder="Search category" value={search_term} onChange={(e) =>{setSearchTerm(e.target.value)}} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
                <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                    variant={"secondary"} 
                    onClick={()=>{setToggleSearch(!toggleSearch)}}
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


            <div className="grid grid-cols-1 gap-6 min-h-[500px]">
                {
                    sn_list && sn_list.length === 0 && <div className="min-h-[500px] w-full flex flex-col items-center justify-center">
                        <div className="relative group flex flex-col items-center">
                            <img src={DeleteIcon} alt="" />
                            <div className="text-sm opacity-0 group-hover:opacity-60 transition"><a href="https://www.flaticon.com/free-icons/damaged" title="Damaged icons">Damaged icons created by Laura Reen - Flaticon</a></div>
                        </div>
                        
                        <div className="font-semibold text-2xl text-green-400">You don't have any Sales Note</div>
                        <p className="max-w-[400px] text-gray-600">Sales notes contains records of your individual sales.</p>
                    </div>
                }
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sales Note No.</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            sn_list ? sn_list.map((sn: SalesNoteMini) => {
                                return (
                                    <TableRow key={sn.id}>
                                        <TableCell>{sn.sales_note_no}</TableCell>
                                        <TableCell>{convert_date(sn.sale_date)}</TableCell>
                                        <TableCell><div className="capitalize">{sn.status}</div></TableCell>
                                        <TableCell>{formatCurrency(sn.total_amount)}</TableCell>
                                        <TableCell>{sn.customer_name||"-"}</TableCell>
                                        <TableCell>
                                            <Link to={`/inventory/manager/sn/${sn.id}`} className="flex items-center gap-2">
                                                <Button variant={"secondary"} size={"sm"}>View</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            }):
                            (
                               [...Array(5)].map((_, i)=>
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