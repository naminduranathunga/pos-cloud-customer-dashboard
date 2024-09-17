import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export default function GenerateSalesReportsPage(){
    return (
        <div>
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Generate Sales Report</h1>
            </header>


            <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-6 md:w-1/2">
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
                </div>
            </div>
        </div>
    )
}