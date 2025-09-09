import { Metadata } from "next";
import AdminLogin from "./AdminLogin";

export const metadata: Metadata = {
    title: "Super Admin Login",

};
export default function Page() {
    return <AdminLogin />
}