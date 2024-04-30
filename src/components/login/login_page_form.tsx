import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


export default function LoginPageForm() {
    return (
        <form className="border rounded-lg shadow-md flex flex-col p-6 min-w-[400px]">
            <h1 className="text-center text-lg md:text-2xl font-semibold mb-6">Login</h1>

            <div className="mb-4 flex flex-col gap-1">
                <Label htmlFor="email" className="text-gray-800">Email:</Label>
                <Input type="email" id="email" placeholder="Email" />
            </div>

            <div className="mb-4 flex flex-col gap-1">
                <Label htmlFor="password" className="text-gray-800">Password:</Label>
                <Input type="password" id="password" placeholder="Password" />
            </div>

            <div className="mb-6 flex gap-1">
                <Checkbox id="remember_me" />
                <Label htmlFor="remember_me" className="text-gray-800">Remember me</Label>
            </div>
            
            <div className="mb-4 flex flex-col gap-1">
                <Button type="button">Login</Button>
            </div>

            
            <div className="mb-4 w-full text-center">
                Forgot your password? <a href="/reset-password" className="text-blue-500">Reset</a>
            </div>
        </form>
    );
}