import { Metadata } from "next";
import AuthPage from "@/app/login/Login"

export const metadata: Metadata = {
    title: "Login",

};
export default function Page() {
    return <AuthPage />
}