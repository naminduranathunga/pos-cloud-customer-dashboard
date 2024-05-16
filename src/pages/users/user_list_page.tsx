import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import LoadingUsersTable from "@/components/users/LoadingUsersTable";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export default function UserListPage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const {
        isLoading,
        user,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Users</h1>

            <Link to={`/users/list/create/`} className="flex items-center gap-2 ms-auto">
                <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New User</Button>
            </Link>
            <Input placeholder="Search category" value={"search_term"} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
            <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                variant={"secondary"} 
                title="Search category"> <Search size={"1em"} /></Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"secondary"} className="hover:bg-green-900 hover:text-white transition"> <EllipsisVertical /> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><FileUp size={"1em"} className="me-2" /> Import</DropdownMenuItem>
                    <DropdownMenuItem><FileDown size={"1em"} className="me-2" /> Export</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </header>


            <div className="grid grid-cols-1 gap-6">
                <LoadingUsersTable />
            </div>

        </div>
    )
}