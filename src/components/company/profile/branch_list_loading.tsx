import { Skeleton } from "@/components/ui/skeleton";

export default function BranchListLoadingComponent(){
    return (
        <div className="branch_list">
            <ul className="divide-y">
                <li className="flex items-center hover:bg-gray-100 transition p-2">
                    <div className="branch_icon p-2 rounded-full mr-4 ">
                        <Skeleton className="w-8 h-8" />
                    </div>
                    <div className="branch_name">
                        <h6><Skeleton className="w-56 h-4 mb-2" /></h6>
                        <div><Skeleton className="w-40 h-3" /></div>
                    </div>
                    <button className="ms-auto p-3 hover:text-green-600">
                        <Skeleton className="w-6 h-6" />
                    </button>
                </li>
                <li className="flex items-center hover:bg-gray-100 transition p-2">
                    <div className="branch_icon p-2 rounded-full mr-4 ">
                        <Skeleton className="w-8 h-8" />
                    </div>
                    <div className="branch_name">
                        <h6><Skeleton className="w-56 h-4 mb-2" /></h6>
                        <div><Skeleton className="w-40 h-3" /></div>
                    </div>
                    <button className="ms-auto p-3 hover:text-green-600">
                        <Skeleton className="w-6 h-6" />
                    </button>
                </li>
                <li className="flex items-center hover:bg-gray-100 transition p-2">
                    <div className="branch_icon p-2 rounded-full mr-4 ">
                        <Skeleton className="w-8 h-8" />
                    </div>
                    <div className="branch_name">
                        <h6><Skeleton className="w-56 h-4 mb-2" /></h6>
                        <div><Skeleton className="w-40 h-3" /></div>
                    </div>
                    <button className="ms-auto p-3 hover:text-green-600">
                        <Skeleton className="w-6 h-6" />
                    </button>
                </li>
                <li className="flex items-center hover:bg-gray-100 transition p-2">
                    <div className="branch_icon p-2 rounded-full mr-4 ">
                        <Skeleton className="w-8 h-8" />
                    </div>
                    <div className="branch_name">
                        <h6><Skeleton className="w-56 h-4 mb-2" /></h6>
                        <div><Skeleton className="w-40 h-3" /></div>
                    </div>
                    <button className="ms-auto p-3 hover:text-green-600">
                        <Skeleton className="w-6 h-6" />
                    </button>
                </li>
                
            </ul>
        </div>
    )
}