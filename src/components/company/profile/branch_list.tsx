import { CompanyBranch } from "@/interfaces/company";
import { ChevronRight, Store } from "lucide-react";
import { Link } from "react-router-dom";


export default function BranchListComponent({branches}:{branches:CompanyBranch[]}){
    return (
        <div className="branch_list">
            <ul className="divide-y">
                {
                    branches.map((branch, index) => (
                        <li key={index} className="flex items-center hover:bg-gray-100 transition p-2">
                            <div className="branch_icon p-2 rounded-full mr-4 ">
                                <Store size={24} />
                            </div>
                            <div className="branch_name">
                                <h6>{branch.name}</h6>
                                <div><Link to={`mailto:${branch.email}`} className="text-green-800 hover:underline text-sm">{branch.email}</Link></div>
                            </div>
                            <button className="ms-auto p-3 hover:text-green-600" title="View Branch">
                                <ChevronRight size={24} />
                            </button>
                        </li>
                    ))
                }
                
            </ul>
        </div>
    )
}