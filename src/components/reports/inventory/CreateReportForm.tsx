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
import { CompanyBranch } from "@/interfaces/company";



export default function CreateReportForm({branchList}:{branchList: CompanyBranch[]}) {
    return (
        <div className="flex flex-col gap-6 md:w-1/2 bg-white p-6 border rounded">
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                    <Label htmlFor="date-from">Date From:</Label>
                    <Input type="date" id="date-from" className="input-box" />
                </div>

                <div className="flex flex-col w-1/2 max-sm:w-full gap-1">
                    <Label htmlFor="date-from">Date To:</Label>
                    <Input type="date" id="date-from" className="input-box" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="branch">Branch:</Label>
                <Select>
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
                <Label htmlFor="branch">Report By:</Label>
                <Select>
                    <SelectTrigger className="w-[180px]" id="branch">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Low Stock</SelectItem>
                        <SelectItem value="dark">Most Sales</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <Button>Generate</Button>
            </div>
        </div>
    )
}