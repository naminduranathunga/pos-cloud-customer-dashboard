import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import CustomerInterface from "@/interfaces/inventory/customer";

async function get_customers(jwt: string, search?: string){
    const url = `${config.apiURL}/inventory-manager/customers/get${search?"?search="+encodeURI(search):""}`;
    const resp = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (!resp.ok){
        throw new Error("Failed to fetch customers");
    }
    const customers = (await resp.json()).data as CustomerInterface[];

    return customers;
}

export default function CustomerSelector({customer, onChange}:{customer:string|CustomerInterface|null, onChange:(customer:CustomerInterface|null)=>void}){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<CustomerInterface[]|null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchValue , setSearchValue] = useState("");
    const selectBtnRef = useRef<HTMLButtonElement>(null);
    const {toast} = useToast();
    const {isLoading, get_user_jwt} = useFlexaroUser();

    const ClearSelection = ()=>{
        onChange(null);
        setIsDialogOpen(false);
    }

    const SelectCustomer = ()=>{
        if (customers === null) return;
        if (selectedIndex > -1){
            onChange(customers![selectedIndex]);
            setIsDialogOpen(false);
            return;
        }

        // check if text === vendor name
        const selectedCustomer = customers.find((v)=>(v.name === searchValue || v.email === searchValue || v.phone === searchValue));
        if (selectedCustomer){
            onChange(selectedCustomer);
            setIsDialogOpen(false);
            return;
        }
        toast({title: "Please select a customer"});
    };

    const onChangeSearch = (e:any)=>{
        if (customers === null) return;
        const selectedCustomer = customers.find((v)=>(v.name === searchValue || v.email === searchValue || v.phone === searchValue));
        if (selectBtnRef.current){
            if (selectedCustomer){
                selectBtnRef.current.disabled = false;
            }else{
                selectBtnRef.current.disabled = true;
            }
        }
        setSelectedIndex(-1);
        
        setSearchValue(e.target.value);
    }

    const onClickItem = (i:number)=>{
        if (selectBtnRef.current){
            selectBtnRef.current.disabled = false;
        }
        setSelectedIndex(i);
    }

    const onKeyDown = (e:any)=>{
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (customers && customers.length > 0){
                setSelectedIndex(Math.min(selectedIndex + 1, customers!.length - 1));
                if (selectBtnRef.current){
                    selectBtnRef.current.disabled = false;
                }
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (customers && customers.length > 0){
                setSelectedIndex(Math.max(selectedIndex - 1, 0));
                if (selectBtnRef.current){
                    selectBtnRef.current.disabled = false;
                }
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex === -1) return;
            onChange(customers![selectedIndex]);
            setIsDialogOpen(false);
        }
    }

    useEffect(()=>{
        console.log("isDialogOpen", isDialogOpen);
        if (!isDialogOpen) {
            setSelectedIndex(-1);
            return;
        };

        console.log("isLoading", isLoading);
        if (isLoading) return;
        console.log("fetching vendors1");
        const jwt = get_user_jwt();
        if (!jwt) return;
        console.log("fetching vendors");
        setCustomers(null);
        get_customers(jwt).then(setCustomers).catch((err)=>{
            console.error(err);
            toast({
                title: "Error",
                description: "An error occured while fetching customers. Please try again later.",
                variant: "destructive"
            });
        });
    }, [isDialogOpen, isLoading, get_user_jwt, toast]);

    useEffect(()=>{
        if (selectBtnRef.current){
            selectBtnRef.current.disabled = true;
        }
    }, [selectBtnRef]);

    let filteredCustomers = customers;
    if (customers && searchValue.length > 0){
        filteredCustomers = customers.filter((v)=>v.name?.toLowerCase().includes(searchValue.toLowerCase()));
    }
    
    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Input id="grn_vendor" value={(customer && typeof customer !== "string") ? customer.name: "Click to select a customer"} className="text-start cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Select a customer</DialogTitle>
                <DialogDescription>
                    <div className="relative">
                        <Input placeholder="Search customer" value={searchValue} onChange={onChangeSearch} className="mt-6" onKeyDown={(e)=>{onKeyDown(e)}} />
                        {(customers === null) &&<div className="absolute h-full flex items-center right-0 top-0 pe-1.5 pointer-events-none">
                            <Loader2 className="animate-spin" />
                        </div>}
                    </div>

                    <ul className="w-full border divide-y mt-4 h-64 overflow-auto rounded-lg">
                        {filteredCustomers && filteredCustomers.map((c, i)=>(
                            <li key={c.id} className={"py-2 px-3 hover:bg-green-400 transition-all duration-200 cursor-pointer" + ((selectedIndex === i)?" bg-green-400":"")} 
                                onClick={()=>{onClickItem(i)}}>{c.name}</li>
                        ))}
                        
                    </ul>
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant={"secondary"} className="btn btn-secondary" onClick={()=>{ClearSelection()}}>Clear</Button>
                    <Button className="btn-select" ref={selectBtnRef} onClick={()=>SelectCustomer()}>Select</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}