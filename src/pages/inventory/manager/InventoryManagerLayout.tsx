import { useToast } from "@/components/ui/use-toast";
import { CompanyBranch } from "@/interfaces/company";
import config from "@/lib/config";
import { BarcodeScannerButton, BarcodeScannerProvider } from "@/lib/hooks/barcode_scanner";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

async function get_branch_list(jwt:string){
    const response2 = await fetch(`${config.apiURL}/company-manager/branches/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    const branches = (await response2.json()) as CompanyBranch[];

    return branches;
}

const selectBranch = (branch:CompanyBranch)=>{
    const jsn = JSON.stringify(branch);
    console.log(jsn);
    localStorage.setItem("inventory_branch", jsn);
}

export default function InventoryManagerLayout(){
    const [branchSelected, setBranchSelected] = useState<null|boolean>(null);
    const [branchList, setBranchList] = useState<Array<CompanyBranch>|null>(null);
    const {get_user_jwt, isLoading} = useFlexaroUser();
    const {toast} = useToast();

    

    useEffect(()=>{
        if (branchSelected !== null) return;
        
        // check a branch is already selected
        const branch = localStorage.getItem("inventory_branch");
        if (typeof branch === "string"){
            // okay
            setBranchSelected(true);
            return;
        }

        // get  branch list
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt){
            document.dispatchEvent(new Event("flexaro_user_unauthorized"));
            return;
        }

        get_branch_list(jwt).then((branches)=>{
            if (branches.length === 1){
                selectBranch(branches[0]);
                setBranchSelected(true);
                return;
            }
            setBranchList(branches);
            setBranchSelected(false);
        }).catch((error)=>{
            toast({
                title:"Error",
                description: "An error occured while getting branch list. Please try again later",
                variant: "destructive"
            });
        });
        
    }, [branchSelected, isLoading]);

    return (
        <>
            { (branchSelected === null) ?(
                <div className="flex flex-col items-center justify-center gap-2 min-h-[50vh] text-2xl">
                    <Loader2 size={"32px"} className=" animate-spin" />
                    Loading...
                </div>
            ):
            (branchSelected === false) ?
            <>Select Branch</>:
            <Outlet />}
        </>
    )
}