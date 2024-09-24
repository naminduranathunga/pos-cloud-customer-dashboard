import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { CompanyBranch } from "@/interfaces/company";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

async function get_branch_list(jwt:string){
    const response2 = await fetch(`${config.apiURL}/company-manager/branches/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    const branches = (await response2.json()) as CompanyBranch[];

    return branches;
}

export default function GenerateSalesReportsPage(){
    const {get_user_jwt, isLoading} = useFlexaroUser();
    const [branchList, setBranchList] = useState<Array<CompanyBranch>|null>(null);
    const [inputs, setInputs] = useState({
        date_from: "",
        date_to: "",
        branch: "",
        organize_by: "products"
    });
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [reportFile, setReportFile] = useState<string|null>(null);
    
    const { toast } = useToast();

    const generate_report = ()=>{
        if (loadingData) return;
        const startDate = new Date(inputs.date_from).toISOString();
        const endDate = new Date(inputs.date_to).toISOString();
        const byProduct = (inputs.organize_by === "products");

        setLoadingData(true);
        fetch(`${config.apiURL}/reports/sales/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${get_user_jwt()}`,
            },
            body: JSON.stringify({
                startDate,
                endDate,
                branch_id: inputs.branch,
                byProduct,
            })
        }).then((res)=>{
            if (res.ok){
                return res.json();
            }
            throw new Error("Something went wrong");
        }).then((data)=>{
            let file = data.file;
            if(file) file = file.replace("/api/v1/", "");
            file = `${config.apiURL}/${file}`;
            setReportFile(file);
            console.log(data, "file", file);
        }).catch((err)=>{
            console.error(err);
            toast({
                title: "An error occured while creating the report"
            })
        }).finally(()=>{
            setLoadingData(false);
        });
    }

    useEffect(() => {
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        get_branch_list(jwt).then((values)=>{
            console.log(values);
            setBranchList(values);
        }).catch((err)=>{
            console.error(err);
            toast({
                title: "Error loading branch list",
                variant: "destructive"
            });
        }).finally(()=>{
            setLoadingData(false);
        });
    }, [isLoading, get_user_jwt]);


    useEffect(()=>{
        if (!branchList || !Array.isArray(branchList) || branchList.length === 0) return;

        let today = new Date();
        let last_year = new Date(today.getFullYear()-1, today.getMonth(), today.getDate());
        setInputs({
            date_from: last_year.toISOString().split("T")[0],
            date_to: today.toISOString().split("T")[0],
            branch: branchList?.[0]?._id ?? "",
            organize_by: "products"
        })
    }, [branchList]);
    return (
        <div>
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Generate Sales Report</h1>
            </header>


            <div className="grid grid-cols-1 gap-6 bg-white p-4 rounded shadow relative">
                {loadingData && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                </div>}
                <div className="flex flex-col gap-6 md:w-1/2">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                            <Label htmlFor="date-from">Date From:</Label>
                            <Input type="date" id="date-from" value={inputs.date_from} onChange={(e)=>{setInputs({...inputs, date_from:e.target.value})}} className="input-box" />
                        </div>

                        <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                            <Label htmlFor="date-from">Date To:</Label>
                            <Input type="date" id="date-from" value={inputs.date_to} onChange={(e)=>{setInputs({...inputs, date_to:e.target.value})}} className="input-box" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:w-1/2">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                            <Label htmlFor="date-from">Branch:</Label>
                            <Select  value={inputs.branch} onValueChange={(val)=>{setInputs({...inputs, branch:val})}}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Array.isArray(branchList) && branchList.map((b)=><SelectItem value={b._id}>{b.name}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:w-1/2">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                            <Label htmlFor="date-from">Organize by:</Label>
                            <Select  value={inputs.organize_by} onValueChange={(val)=>{setInputs({...inputs, organize_by:val})}}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="products">Products</SelectItem>
                                    <SelectItem value="sales_notes">Sales Notes</SelectItem>
                                    <SelectItem value="customers">Customers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:w-1/2">
                    <Button onClick={generate_report}>Generate</Button>
                </div>

                {(reportFile !== null) && <div className="flex flex-col gap-6 md:w-1/2">
                    <a href={reportFile} target="_blank" className=""><Button variant={"destructive"} >Download</Button></a>
                </div>}
            </div>
        </div>
    )
}