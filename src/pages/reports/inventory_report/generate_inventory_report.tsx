import CreateReportForm from "@/components/reports/inventory/CreateReportForm";
import { CompanyBranch } from "@/interfaces/company";
import get_branch_list from "@/lib/get_branch_list";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useEffect, useState } from "react";





export default function GenerateInventoryReportsPage(){
    const [branchList, setBranchList] = useState<CompanyBranch[]>([]);
    const { user, isLoading, get_user_jwt } = useFlexaroUser();


    useEffect(()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt){
            document.dispatchEvent(new Event("flexaro_user_unauthorized"));
            return
        }
        get_branch_list(jwt).then((branches)=>{
            setBranchList(branches);
            console.log(branches);
        });
        
    }, [isLoading, user, get_user_jwt]);
    return (
        <div>
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Generate Inventory Report</h1>
            </header>


            <div className="grid grid-cols-1 gap-6">
                <CreateReportForm branchList={branchList} />
            </div>
        </div>
    )
}