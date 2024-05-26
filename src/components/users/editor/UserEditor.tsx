import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullUser, SumpleUserRole } from "@/interfaces/company_users";
import { useCallback } from "react";
import UserPasswordEditor from "./UserPasswordEditor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Link } from "react-router-dom";

export default function UserAccountEditor({user, setUser, user_roles}:{user: FullUser, setUser: (user: FullUser) => void, user_roles:SumpleUserRole[]}){
    const onPwChange = useCallback((password:string)=>{
        if (user._id) return;
        setUser({...user, password: password});
    }, [user]);

    const onChangeUserRole = useCallback((role_id: string)=>{
        const role = user_roles.find((role)=>role._id === role_id);
        if (role === undefined) return;
        setUser({...user, role: role});
    }, [user, user_roles]);
    const role_options = user_roles.map((role, idx) => {
        return (
            <SelectItem key={idx} value={role._id}>{role.name}</SelectItem>
        )
    });
    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="fr-vded-12">First Name</Label>
                    <Input id="fr-vded-12" type="text" value={user.first_name} onChange={(e) => {
                        setUser({...user, first_name: e.target.value});
                    }} autoComplete="off" aria-autocomplete="none" />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" type="text" value={user.last_name} onChange={(e) => {
                        setUser({...user, last_name: e.target.value});
                     }} />
                </div>
            </div>

            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="user_email">Email</Label>
                    <Input id="user_email" type="text" value={user.email} onChange={(e) => {
                        setUser({...user, email: e.target.value});
                    }} />
                </div>
            </div>


            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="user_role">Role</Label>
                    <Select value={user.role._id} onValueChange={onChangeUserRole}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {role_options}
                        </SelectContent>
                    </Select>
                    <Link to={"/users/roles/edit?_id=" + user.role._id} target="_blank" className="text-green-800 hover:underline">View</Link>
                    
                </div>
            </div>

            <UserPasswordEditor id={user._id} onPasswordChange={onPwChange} />
        </div>
    )
}