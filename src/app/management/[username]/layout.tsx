"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./page"; // Adjust this path if Sidebar is in another location
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<any>();
    const [Name, setName] = useState<any>();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const memberId = localStorage.getItem("memberId");
        setUserName(memberId);

        const memberName = localStorage.getItem("memberName");
        setName(memberName);

        if (!memberId) {
            window.location.href = "/login";
        }

    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="d-flex flex-column vh-100">
            <div className="d-flex">
                {/* Desktop Sidebar */}
                <div className="d-none d-lg-block">
                    <Sidebar username={userName} />
                </div>

                {/* Mobile Sidebar (Offcanvas) */}
                <Offcanvas
                    style={{ width: "280px", padding: "0px" }}
                    show={sidebarOpen}
                    onHide={() => setSidebarOpen(false)}
                >
                    <Offcanvas.Header closeButton></Offcanvas.Header>
                    <Offcanvas.Body>
                        <Sidebar username={userName} />
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main Content Area */}
                <div className="w-100">
                    <nav
                        className={`navbar navbar-light border-bottom px-3 w-100 ${styles.navbarCustom}`}
                    >
                        <div className="container-fluid d-flex justify-content-between align-items-center">
                            <Button
                                variant="primary"
                                className="d-lg-none"
                                onClick={() => setSidebarOpen(true)}
                            >
                                ☰
                            </Button>
                            <h3 className={styles.welcomeText}>Welcome, {Name}</h3>
                            <button className={`btn ${styles.logoutBtn}`} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </nav>

                    <div className={styles.mainContent}>{children}</div>
                </div>
            </div>
        </div>
    );
}
