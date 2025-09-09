"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "./page";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [userId, setuserId] = useState<string | null>(null);
    const [userName, setuserName] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const username = params?.username as string;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberId = localStorage.getItem("SuperAdminID");
            const superAdminName = localStorage.getItem("SuperAdminName");

            if (!memberId) {
                router.push("/login/superadmin");
            } else {
                setuserId(memberId);
                setuserName(superAdminName);
                if (memberId !== username) {
                    router.replace(`/superadmin/${memberId}`);
                }
            }
        }
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.clear();
            router.push("/login/superadmin");
        }
    };

    return (
        <div className="d-flex flex-column vh-100">
            <div className="d-flex">
                {/* Desktop Sidebar */}
                <div className="d-none d-lg-block">
                    <Sidebar username={userId} />
                </div>

                {/* Mobile Sidebar */}
                <Offcanvas
                    style={{ width: "280px", padding: "0px" }}
                    show={sidebarOpen}
                    onHide={() => setSidebarOpen(false)}
                >
                    <Offcanvas.Header closeButton></Offcanvas.Header>
                    <Offcanvas.Body>
                        <Sidebar username={userId} />
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main Content */}
                <div className="w-100">
                    <nav className={`navbar navbar-light border-bottom px-3 w-100 ${styles.navbarCustom}`}>
                        <div className="container-fluid d-flex justify-content-between align-items-center">
                            <Button variant="primary" className="d-lg-none" onClick={() => setSidebarOpen(true)}>
                                ☰
                            </Button>
                            <h3 className={styles.welcomeText}>Welcome, {userName || "User"}</h3>
                            <Button variant="danger" onClick={handleLogout}>Logout</Button>
                        </div>
                    </nav>

                    <div className={styles.mainContent}>{children}</div>
                </div>
            </div>
        </div>
    );
}
