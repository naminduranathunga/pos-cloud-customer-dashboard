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



export default function CreateReportForm({branchList}:{branchList: CompanyBranch[]}) {
    const { toast } = useToast();
    const {get_user_jwt, isLoading} = useFlexaroUser();
    
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [reportFile, setReportFile] = useState<string|null>(null);
    const [inputs, setInputs] = useState({
        date_from: "",
        date_to: "",
        branch: "",
    });
    const generateReport = ()=>{
        if (loadingData) return;
        const startDate = new Date(inputs.date_from).toISOString();
        const endDate = new Date(inputs.date_to).toISOString();

        setLoadingData(true);
        fetch(`${config.apiURL}/reports/inventory/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${get_user_jwt()}`,
            },
            body: JSON.stringify({
                startDate,
                endDate,
                branch_id: inputs.branch,
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

    useEffect(()=>{
        if (!branchList || !Array.isArray(branchList) || branchList.length === 0) return;

        let today = new Date();
        let last_year = new Date(today.getFullYear()-1, today.getMonth(), today.getDate());
        setInputs({
            date_from: last_year.toISOString().split("T")[0],
            date_to: today.toISOString().split("T")[0],
            branch: branchList?.[0]?._id ?? "",
        })
    }, [branchList]);
    return (
        <div className="flex flex-col gap-6 md:w-1/2 bg-white p-6 border rounded relative">
            {loadingData && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                </div>}
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                    <Label htmlFor="date-from">Date From:</Label>
                    <Input type="date" id="date-from" value={inputs.date_from} onChange={(e)=>{setInputs({...inputs, date_from:e.target.value})}} className="input-box" />
                </div>

                <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                    <Label htmlFor="date-to">Date To:</Label>
                    <Input type="date" id="date-to" value={inputs.date_to} onChange={(e)=>{setInputs({...inputs, date_to:e.target.value})}} className="input-box" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="branch">Branch:</Label>
                <Select value={inputs.branch} onValueChange={(val)=>{setInputs({...inputs, branch:val})}}>
                    <SelectTrigger className="w-[180px]" id="branch">
                        <SelectValue placeholder="Select the branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            branchList.map((branch, index)=>{
                                return (
                                    <SelectItem key={index} value={branch._id}>{branch.name}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <Button onClick={generateReport}>Generate</Button>
            </div>

            {(reportFile !== null) && <div className="flex flex-col gap-6 md:w-1/2">
                    <a href={reportFile} target="_blank" className=""><Button variant={"destructive"} >Download</Button></a>
                </div>}
        </div>
    )
}