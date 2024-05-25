import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserRoleEditor from "@/components/users/roles/editor/UserRoleEditor";
import { FullUserRole, UserRolePermission } from "@/interfaces/company_users";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const empty_user_role: FullUserRole = {
    _id: 0,
    name: "",
    slug: "",
    is_public: false,
    permissions: []
}

export default function EditUserRolePage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<FullUserRole | null>(null);
    const [permission_list, setPermissionList] = useState<UserRolePermission[] | null>(null);

    const {
        isLoading,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    const tottleSearchFn = useCallback(() => {
        setToggleSearch(!toggleSearch);
    }, [toggleSearch]);

    // get user role data
    useEffect(() => {
        if (isLoading) return;
        if (userRole !== null) return;

        // get url params
        const urlParams = new URLSearchParams(window.location.search);
        const role_id = urlParams.get("_id");
        if (role_id === null){
            setUserRole(empty_user_role);
            return;
        }

        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get?with_permissions=true&_id=${role_id}`, {
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
            if (roles.length > 0){
                setUserRole(roles[0]);
            } else {
                throw new Error("No roles found");
            }
        }).catch((err)=>{
            setUserRole(empty_user_role);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, userRole]);

    useEffect(() => {
        if (isLoading) return;
        if (permission_list !== null) return;

        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get_permissions`, {
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
        }).then((permissions)=>{
            setPermissionList(permissions);
            console.log(permissions);
        }).catch((err)=>{
            setPermissionList([]);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, permission_list]);

    const setUserRoleFn = (role: FullUserRole) => {
        setUserRole(role);
    }
    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-10">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">User Roles</h1>

            <Link to={`/users/list/create/`} className="flex items-center gap-2 ms-auto">
                <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New Role</Button>
            </Link>
            <Input placeholder="Search category" value={search_term} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
            <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                variant={"secondary"} 
                onClick={tottleSearchFn}
                title="Search category"> <Search size={"1em"} /></Button>
            </header>


            <div className="grid grid-cols-1 gap-6">
                {(userRole && permission_list) ? <UserRoleEditor userRole={userRole} permissions={permission_list} setUserRole={setUserRoleFn} />
                    : <div>Loading...</div>
                }
            </div>

        </div>
    )
}