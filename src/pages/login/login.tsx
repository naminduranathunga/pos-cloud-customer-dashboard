import LoginPageForm from "@/components/login/login_page_form";
import { Toaster } from "@/components/ui/toaster";


export default function LoginPage() {
    return (
        <div className="flex justify-center items-center h-[100vh]">
            <LoginPageForm />
            <Toaster />
        </div>
    );
}