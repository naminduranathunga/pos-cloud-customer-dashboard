import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyDetailsLoadingComponent(){

    return (
        <table className="mb-12">
            <tr>
                <td className="py-2 pe-3"><Skeleton className="w-12 h-4" /></td>
                <td className="p-2"><Skeleton className="w-44 h-4" /></td>
            </tr>
            <tr>
                <td className="py-2 pe-3"><Skeleton className="w-12 h-4" /></td>
                <td className="py-2"><Skeleton className="w-44 h-4" /></td>
            </tr>
            <tr>
                <td className="py-2 pe-3"><Skeleton className="w-12 h-4" /></td>
                <td className="py-2"><Skeleton className="w-44 h-4" /></td>
            </tr>
            <tr>
                <td className="py-2 pe-3 align-top"><Skeleton className="w-12 h-4" /></td>
                <td className="py-2">
                    <ul>
                        <li><Skeleton className="w-44 h-4 mb-1" /></li>
                        <li><Skeleton className="w-44 h-4 mb-1" /></li>
                        <li><Skeleton className="w-44 h-4 mb-1" /></li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className="py-2 pe-3"><Skeleton className="w-12 h-4" /></td>
                <td className="py-2"><Skeleton className="w-44 h-4" /></td>
            </tr>
        </table>
    )
}