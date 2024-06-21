import CompanyBranchEditor from "@/components/company/profile/CompanyBranchEditor";
import BranchListComponent from "@/components/company/profile/branch_list";
import BranchListLoadingComponent from "@/components/company/profile/branch_list_loading";
import CompanyDetailsComponent from "@/components/company/profile/company_details";
import CompanyDetailsLoadingComponent from "@/components/company/profile/company_details_loading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CompanyBranch, CompanyDetails } from "@/interfaces/company";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


async function get_company_details(jwt:string) {
    const response = await fetch(`${config.apiURL}/company-manager/get-company-profile`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    const company = (await response.json()) as CompanyDetails; 
    const response2 = await fetch(`${config.apiURL}/company-manager/branches/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });

    if (response2.status === 401) {
        throw new Error("Unauthorized");
    }

    const branches = (await response2.json()) as CompanyBranch[];

    return {
        company,
        branches
    }
}

export default function CompanyProfilePage(){
    const [ company, setCompany ] = useState<CompanyDetails | null>(null);
    const [ branches, setBranches ] = useState<CompanyBranch[] | null>(null);
    const [ editingBranch, setEditingBranch ] = useState<CompanyBranch | null>(null); // [branch_id, branch_id, branch_id
    const { get_user_jwt, isLoading } = useFlexaroUser();
    const { toast } = useToast();

    useEffect(()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        get_company_details(jwt).then(
            (data) => {
                setCompany(data.company);
                setBranches(data.branches);
            }
        ).catch(
            (err) => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to fetch company details",
                    variant: "destructive"
                });
            }
        )
    }, [get_user_jwt, isLoading, toast])
    
    const showBranchEditor  = (branch_id:string) => {
        if (branch_id === "") {
            setEditingBranch({
                _id: "new",
                name: "",
                address: "",
                phone: [],
                email: ""
            });
        } else {
            const branch = branches?.find((b)=> b._id === branch_id);
            if (branch) {
                setEditingBranch(branch);
            }else {
                toast({
                    title: "Error",
                    description: "Branch not found",
                    variant: "destructive"
                });
            }
        }
    }

    const onCloseEditor = () =>{ 
        setEditingBranch(null);
    }

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Company Profile</h1>

            
            
            </header>


            <div className="grid grid-cols-2 gap-6">
                <div>
                    { company ? (<CompanyDetailsComponent company={company} />): <CompanyDetailsLoadingComponent /> }
                    
                    <hr/>

                    <h2 className="font-semibold text-2xl mt-4 mb-4">Selected Subscription</h2>
                    <div className="flex gap-4">
                        <div className="w-28 h-40 bg-green-100 rounded">

                        </div>
                        <div className="flex flex-col gap-0" >
                            <h3 className="text-xl font-semibold">Premium</h3>
                            <div className="text-gray-400">Value: 3500/mo - (yearly)</div>
                            <Link reloadDocument to="/company/subscription" className="text-green-800 hover:underline mt-auto mb-4">View Details</Link>
                        </div>

                    </div>

                </div>
                <div>
                <h2 className="font-semibold text-2xl">Branches</h2>
                {
                    branches ? <BranchListComponent branches={branches} /> : <BranchListLoadingComponent />
                }
                <Button className="mt-6" onClick={()=>{showBranchEditor("")}}>Add Branch</Button>'
                
                {
                    (editingBranch != null) ? <CompanyBranchEditor _id={company?._id} branch={editingBranch} with_trigger={false} onClose={onCloseEditor} /> : null
                }
                </div>
            </div>
            
        </div>
    )
}