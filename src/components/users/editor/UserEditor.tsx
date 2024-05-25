import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullUser } from "@/interfaces/company_users";


export default function UserAccountEditor({user}:{user: FullUser}){
    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" type="text" value={user.first_name} onChange={(e) => {
                        
                    }} />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" type="text" value={user.last_name} />
                </div>
            </div>

            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="user_email">Email</Label>
                    <Input id="user_email" type="text" value={user.email} onChange={(e) => {
                        
                    }} />
                </div>
            </div>


            <div className="flex gap-8">
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="user_role">Role</Label>
                    <Input id="user_role" type="text" value={user.role.name} onChange={(e) => {
                        
                    }} />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-full">
                    <h2 className="text-lg font-semibold">Password</h2>
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="first_name">New Password</Label>
                    <Input id="first_name" type="password" value="" onChange={(e) => {
                        
                    }} autoComplete="new-password" />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="last_name">Confirm Password</Label>
                    <Input id="last_name" type="password" value="" />
                </div>
            </div>
        </div>
    )
}