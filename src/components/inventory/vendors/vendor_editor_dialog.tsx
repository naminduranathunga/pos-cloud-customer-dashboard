import { VendorInterface } from "@/interfaces/inventory/vendor";
import { useCallback, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import config from "@/lib/config";

export default function VendorEditorDialog({vendor, onclose, onsave, with_trigger}: {vendor: VendorInterface, onclose: () => void, onsave: (vendor: VendorInterface) => void, with_trigger?: boolean}){
    const [vendorState, setVendorState] = useState<VendorInterface>(vendor);
    const [is_updating_server, setIsUpdatingServer] = useState(false);
    const {toast} = useToast();
    const { isLoading, get_user_jwt } = useFlexaroUser();
    
    const saveVendor = useCallback(() => {
        if (is_updating_server) return;
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        //validate
        if (vendorState.name.trim() === "") {
            toast({
                title: "Name is required",
                variant: "destructive"
            });
            return;
        }

        setIsUpdatingServer(true);
        let url = "";
        if (vendorState.id){
            url = `${config.apiURL}/inventory-manager/vendors/update`;
        } else {
            url = `${config.apiURL}/inventory-manager/vendors/create`;
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(vendorState),
        }).then(resp => {
            if (resp.ok){
                toast({
                    title: "Vendor saved",
                });
                onsave(vendorState);
            } else {
                toast({
                    title: "Failed to save vendor",
                    variant: "destructive"
                });
            }
        }).catch(err => {
            toast({
                title: "Failed to save vendor",
                variant: "destructive"
            });
            console.error(err);
        }).finally(() => {
            setIsUpdatingServer(false);
        });

    }, [vendorState, is_updating_server, isLoading, get_user_jwt, onsave, toast]);

    const onOpenChange = useCallback((open:boolean) => {
        if (!open && onclose) onclose();
    }, [onclose]);

    if (typeof with_trigger === "undefined") with_trigger = false;

    useEffect(()=>{
        setVendorState(vendor);
    }, [vendor]);

    return (
        <Dialog defaultOpen={(!with_trigger)} onOpenChange={onOpenChange}>
            {with_trigger && <DialogTrigger>Open</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{ vendorState.id ? "Edit Vendor" : "New Vendor" }</DialogTitle>
                <DialogDescription>
                <div className="max-w-[400px] pt-8">

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Name </Label>
                        <Input value={vendorState.name} onChange={(e) => {
                            setVendorState({...vendorState, name: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Email </Label>
                        <Input value={vendorState.email} onChange={(e) => {
                            setVendorState({...vendorState, email: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Phone </Label>
                        <Input value={vendorState.phone} onChange={(e) => {
                            setVendorState({...vendorState, phone: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Address </Label>
                        <Input value={vendorState.address} onChange={(e) => {
                            setVendorState({...vendorState, address: e.target.value});
                        }} />
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex items-center" onClick={saveVendor}>
                            <span>Save</span>
                            {is_updating_server && <Loader2 className="animate-spin ms-2" size={20} />}
                        </Button>
                    </div>
                </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}