import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserRolesTable from "@/components/users/roles/UserRolesTable";
import { SumpleUserRole } from "@/interfaces/company_users";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserRolesListPage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [user_roles, setUserRoles] = useState<SumpleUserRole[] | null>(null); // [1
    const {
        isLoading,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);

    useEffect(() => {
        if (isLoading) return;
        if (user_roles !== null) return;
        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).then((response)=>{
            if (!response.ok){
                if (response.status === 401){
                    toast({title: "Unauthorized", description: "You are not authorized to view this page"});
                    setTimeout(()=>{window.location.href = "/login"}, 500);
                    return;
                }
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((roles)=>{
            setUserRoles(roles);
        }).catch((err)=>{
            setUserRoles([]);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, user_roles]);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">User Roles</h1>

            <Link to={`/users/list/create/`} reloadDocument className="flex items-center gap-2 ms-auto">
                <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New Role</Button>
            </Link>
            <Input placeholder="Search category" value={search_term} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
            <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                variant={"secondary"} 
                onClick={tottleSearchFn}
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
                <UserRolesTable roles={user_roles} />
            </div>

        </div>
    )
}