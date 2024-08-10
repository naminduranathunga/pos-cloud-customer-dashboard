import { Button } from "@/components/ui/button";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useToast } from "@/components/ui/use-toast";
import config from "@/lib/config";
import { useConfirm } from "@/components/ui/custom/confirm";
import CustomerInterface from "@/interfaces/inventory/customer";
import CustomerTable from "@/components/inventory/customers/customers_table";
import CustomerEditorDialog from "@/components/inventory/customers/customer_editor_dialog";

async function fetchCustomer(jwt:string): Promise<{customers:CustomerInterface[], total:number}>{
    const resp = await fetch(`${config.apiURL}/inventory-manager/customers/get?max_results=yes`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (resp.ok){
        const customers_ = await resp.json();
        const customers: CustomerInterface[] = customers_.data.map((v: CustomerInterface) => {
            return {
                id: v.id,
                name: v.name,
                phone: v.phone,
                email: v.email,
                address: v.address
            }
        });
        return {customers, total:customers_.total as number};
    }else {
        if (resp.status === 401){
            throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch categories");
    }
}

function createNewVendor(){
    return {
        name: "",
        phone: "",
        email: "",
        address: "",
    } as CustomerInterface;
}

export default function CustomerListPage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const {toast} = useToast();
    const { get_user_jwt, isLoading } = useFlexaroUser();
    const [customers, setCustomers] = useState<CustomerInterface[]|null>(null);
    const [editingCustomer, setEditingCustomer] = useState<CustomerInterface | null>(null);
    const confirm = useConfirm();

    const tottleSearchFn = ()=>{
        setToggleSearch(!toggleSearch);
    }

    const deleteVendor = useCallback((vendor: CustomerInterface)=>{
        if (isLoading) return;
        confirm.Confirm("Delete Vendor", `Are you sure you want to delete ${vendor.name}`, "destructive", (confirmed: boolean)=>{
            if (!confirmed) return;
            const jwt = get_user_jwt();
            if (!jwt) return;

            fetch(`${config.apiURL}/inventory-manager/customers/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({id: vendor.id}),
            }).then(resp => {
                if (resp.ok){
                    toast({
                        title: "Vendor deleted",
                    });
                    if (!customers) return;
                    setCustomers(customers.filter((v: CustomerInterface) => v.id !== vendor.id));
                } else {
                    toast({
                        title: "Failed to delete vendor",
                        variant: "destructive"
                    });
                }
            }).catch(err => {
                toast({
                    title: "Failed to delete vendor",
                    variant: "destructive"
                });
            });
        });
    }, [customers, get_user_jwt, toast, confirm, isLoading]);
    


    useEffect(()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        fetchCustomer(jwt).then(({customers})=>{
            setCustomers(customers);
        }).catch((err)=>{
            toast({
                title: "Failed to fetch customers",
                variant: "destructive",
            });
        })
    }, [isLoading, get_user_jwt, toast])

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Product Categories</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={()=>{setEditingCustomer(createNewVendor())}}> <Plus size={"1em"} /> New Vendor</Button>
                <Input placeholder="Search category" value={search_term} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
                <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                    variant={"secondary"} 
                    onClick={tottleSearchFn}
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
                {
                    customers ? (
                        <CustomerTable customers={customers} onEdit={setEditingCustomer} onDelete={deleteVendor} />
                    ) : (
                        <div className="text-center">Loading...</div>
                    )
                }
            </div>
            {
                (editingCustomer) && (<CustomerEditorDialog customer={editingCustomer} onclose={()=>{setEditingCustomer(null)}} onsave={(vendor: CustomerInterface)=>{
                    let updated = false;
                    let newlist = customers?customers.map((v: CustomerInterface) => {
                        if (v.id === vendor.id){
                            updated = true;
                            return vendor;
                        }
                        return v;
                    }):[];
                    if (!updated){
                        newlist.push(vendor);
                    }
                    setCustomers(newlist);
                    setEditingCustomer(null);
                }} />)
            }
        </div>
    )
}