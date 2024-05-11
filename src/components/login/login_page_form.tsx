import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import config from "@/lib/config";
import useFlexaroUser, { FlexaroUser } from "@/lib/hooks/flexaro_user";




export default function LoginPageForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [is_login_loading, setIsLoginLoading] = useState(false);
    const {toast} = useToast();
    const { login } = useFlexaroUser();
    

    
    const handleLogin = () => {
        if (is_login_loading) return;
        if (!email || !password){
            toast({
                title: "Error",
                description: "Email and password are required.",
                variant:"destructive"
            });
            return;
        }

        setIsLoginLoading(true);
        fetch(`${config.apiURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                rememberMe
            })
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                res.json().then((data)=>{
                    toast({
                        title: "Error",
                        description: data.message,
                        variant:"destructive"
                    });
                }).catch((error)=>{
                    toast({
                        title: "Internal Server Error",
                        description: "Failed to login. Please try again later.",
                        variant:"destructive"
                    });
                });
            }
        }).then((data)=>{
            
            const user:FlexaroUser = {
                id: data.user._id,
                data: data.user,
                jwt: data.token
            };
            console.log(user);
            
            login(user);
            toast({
                title: "Success",
                description: "You will be redirected to the dashboard shortly.",
            });
            window.location.href = "/dashboard";
        }).catch((error)=>{
            toast({
                title: "Internal Server Error",
                description: "Failed to login. Please try again later.",
                variant:"destructive"
            });
        }).finally(()=>{
            setIsLoginLoading(false);
        });
    }


    return (
        <form className="border rounded-lg shadow-md flex flex-col p-6 min-w-[400px]">
            <h1 className="text-center text-lg md:text-2xl font-semibold mb-6">Login</h1>

            <div className="mb-4 flex flex-col gap-1">
                <Label htmlFor="email" className="text-gray-800">Email:</Label>
                <Input type="email" id="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            </div>

            <div className="mb-4 flex flex-col gap-1">
                <Label htmlFor="password" className="text-gray-800">Password:</Label>
                <Input type="password" id="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            </div>

            <div className="mb-6 flex gap-1">
                <Checkbox id="remember_me" checked={rememberMe} onChange={(e)=>{setRememberMe((e.target as HTMLInputElement).checked)}} />
                <Label htmlFor="remember_me" className="text-gray-800">Remember me</Label>
            </div>
            
            <div className="mb-4 flex flex-col gap-1">
                <Button type="button" onClick={handleLogin}>
                    Login
                    {is_login_loading && <i className="animate-spin ms-2 fas fa-spinner"></i>}
                </Button>
            </div>

            
            <div className="mb-4 w-full text-center">
                Forgot your password? <a href="/reset-password" className="text-blue-500">Reset</a>
            </div>
        </form>
    );
}