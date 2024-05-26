import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Label } from "@radix-ui/react-label";
import { Loader, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length > 6) score++;
    if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) score++;
    if (password.match(/\d+/)) score++;
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) score++;
    if (password.length > 12) score++;
    return Math.round(score / 5 * 100);
}

export default function UserPasswordEditor({id, onPasswordChange}:{id?: string, onPasswordChange?: (password: string) => void}){
    const [newPwd, setNewPwd] = useState('');
    const [newPwdConf, setNewPwdConf] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const { isLoading, get_user_jwt } = useFlexaroUser();
    const onClickChangePassword = useCallback(() => {
        if (isLoading) return;
        const pwdStrength = checkPasswordStrength(newPwd);
        if (!id) return;

        if (newPwd.length < 1){
            toast({title: "Error", description: "Password is required", variant: "destructive"});
            return;
        }
        if (newPwd !== newPwdConf) {
            return;
        }
        const jwt = get_user_jwt();
        setIsChanging(true);

        fetch(`${config.apiURL}/user-manager/users/update`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: id,
                password: newPwd
            })
        }).then((response)=>{
            if (!response.ok){
                if (response.status === 401){
                    throw new Error("Unauthorized");
                }
                throw new Error("Failed to update password");
            }
            toast({title: "Success", description: "Password updated successfully"});

        }).catch((err)=>{
            console.error(err);
        }).finally(()=>{
            setIsChanging(false);
        });        
    }, [isLoading, newPwd, newPwdConf, get_user_jwt]);

    const pwdStrength = checkPasswordStrength(newPwd);
    const bg_color = pwdStrength > 70 ? 'bg-green-500' : pwdStrength > 40 ? 'bg-yellow-500' : 'bg-red-500';
    const pwdStrengthText = pwdStrength > 70 ? 'Strong' : pwdStrength > 40 ? 'Medium' : 'Weak';


    return (
        <div className="flex flex-col gap-4">
            <div className="w-full">
                <h2 className="text-lg font-semibold">Password</h2>
            </div>
            <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" value={newPwd} onChange={(e) => {
                    setNewPwd(e.target.value);
                    if (onPasswordChange) {
                        onPasswordChange(e.target.value);
                    }
                }} autoComplete="new-password" />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="password_confirm">Confirm Password</Label>
                <Input id="password_confirm" type="password" value={newPwdConf} onChange={(e) => {
                    setNewPwdConf(e.target.value);
                }} 
                autoComplete="new-password" />
                { (newPwd && newPwd !== newPwdConf) && <div className="w-full text-red-500 text-sm">Password does not match.</div>}
                
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-clip mt-2">
                    <div className={`h-3 rounded-full transition-all ${bg_color}`} style={{width:`${pwdStrength}%`}}></div>
                </div>
                <div className="h-3 w-full flex items-center justify-center text-gray-500 text-sm font-semibold">{pwdStrengthText}</div>

            </div>
            
            <div className="flex gap-2 w-1/2">
                <Button className="flex items-center" onClick={onClickChangePassword}>
                    <div>Change</div> 
                    { isChanging &&<Loader2 className=" ms-1 text-white animate-spin" size={"1.25rem"} /> }
                </Button>
            </div>

        </div>
    )
}