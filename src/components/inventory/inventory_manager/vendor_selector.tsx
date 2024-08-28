import { Vendor } from "@/interfaces/inventory/grn";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";

async function get_vendors(jwt: string, search?: string){

    const url = `${config.apiURL}/inventory-manager/vendors/get${search?"?search="+encodeURI(search):""}`;
    const resp = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (!resp.ok){
        throw new Error("Failed to fetch vendors");
    }
    const vendors = (await resp.json()).data as Vendor[];

    return vendors;
}

export default function VendorSelector({vendor, onChange}:{vendor:string|Vendor|null, onChange:(vendor:Vendor|null)=>void}){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vendors, setVendors] = useState<Vendor[]|null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchValue , setSearchValue] = useState("");
    const selectBtnRef = useRef<HTMLButtonElement>(null);
    const {toast} = useToast();
    const {isLoading, get_user_jwt} = useFlexaroUser();

    const ClearSelection = ()=>{
        onChange(null);
        setIsDialogOpen(false);
    }

    const SelectVendor = ()=>{
        if (vendors === null) return;
        if (selectedIndex > -1){
            onChange(vendors![selectedIndex]);
            setIsDialogOpen(false);
            return;
        }

        // check if text === vendor name
        const selectedVendor = vendors.find((v)=>v.name === searchValue);
        if (selectedVendor){
            onChange(selectedVendor);
            setIsDialogOpen(false);
            return;
        }
        toast({title: "Please select a vendor"});
    };

    const onChangeSearch = (e:any)=>{
        if (vendors === null) return;
        const selectedVendor = vendors.find((v)=>v.name === searchValue);
        if (selectBtnRef.current){
            if (selectedVendor){
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
            if (vendors && vendors.length > 0){
                setSelectedIndex(Math.min(selectedIndex + 1, vendors!.length - 1));
                if (selectBtnRef.current){
                    selectBtnRef.current.disabled = false;
                }
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (vendors && vendors.length > 0){
                setSelectedIndex(Math.max(selectedIndex - 1, 0));
                if (selectBtnRef.current){
                    selectBtnRef.current.disabled = false;
                }
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex === -1) return;
            onChange(vendors![selectedIndex]);
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
        setVendors(null);
        get_vendors(jwt).then(setVendors).catch((err)=>{
            console.error(err);
            toast({
                title: "Error",
                description: "An error occured while fetching vendors. Please try again later.",
                variant: "destructive"
            });
        });
    }, [isDialogOpen, isLoading, get_user_jwt]);

    useEffect(()=>{
        if (selectBtnRef.current){
            selectBtnRef.current.disabled = true;
        }
    }, [selectBtnRef]);

    let filteredVendors = vendors;
    if (vendors && searchValue.length > 0){
        filteredVendors = vendors.filter((v)=>v.name?.toLowerCase().includes(searchValue.toLowerCase()));
    }
    
    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Input id="grn_vendor" value={(vendor && typeof vendor !== "string") ? vendor.name: "Click to select a vendor"} className="text-start cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Select a vendor</DialogTitle>
                <DialogDescription>
                    <div className="relative">
                        <Input placeholder="Search vendor" value={searchValue} onChange={onChangeSearch} className="mt-6" onKeyDown={(e)=>{onKeyDown(e)}} />
                        {(vendors === null) &&<div className="absolute h-full flex items-center right-0 top-0 pe-1.5 pointer-events-none">
                            <Loader2 className="animate-spin" />
                        </div>}
                    </div>

                    <ul className="w-full border divide-y mt-4 h-64 overflow-auto rounded-lg">
                        {filteredVendors && filteredVendors.map((v, i)=>(
                            <li key={v.id} className={"py-2 px-3 hover:bg-green-400 transition-all duration-200 cursor-pointer" + ((selectedIndex === i)?" bg-green-400":"")} 
                                onClick={()=>{onClickItem(i)}}>{v.name}</li>
                        ))}
                        
                    </ul>
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant={"secondary"} className="btn btn-secondary" onClick={()=>{ClearSelection()}}>Clear</Button>
                    <Button className="btn-select" ref={selectBtnRef} onClick={()=>SelectVendor()}>Select</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}