"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./page";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { getFlatNumber, getSocietyId, getSocietyName } from "@/config/apiConfig";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [Name, setName] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedSociety, setSelectedSociety] = useState<{ label: string; value: string } | null>(null);
    const [flatNumber, setFlatNumber] = useState<string | null>(null);

    useEffect(() => {

        const memberId = localStorage.getItem("memberId");
        const memberName = localStorage.getItem("memberName");
        const flatNum = getFlatNumber();
        setFlatNumber(flatNum);
        if (!memberId) {
            window.location.href = "/login";
            return;
        }

        setUserId(memberId);
        setName(memberName);
        setFlatNumber(flatNum);
        setSelectedSociety({
            value: getSocietyId() || "",
            label: getSocietyName() || "No Society Selected",
        });


    }, []);

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

                <div className="w-100">
                    <nav
                        className={`navbar navbar-expand-lg shadow-sm px-4 py-3 ${styles.navbarCustom}`}
                        style={{ background: "linear-gradient(90deg, #4b6cb7, #182848)" }}
                    >
                        <div className="container-fluid d-flex justify-content-between align-items-center">
                            {/* Mobile sidebar toggle */}
                            <Button
                                variant="light"
                                className="d-lg-none me-2"
                                onClick={() => setSidebarOpen(true)}
                            >
                                ☰
                            </Button>

                            {/* Welcome + Society + Flat */}
                            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
                                <span className="fw-semibold text-white">
                                    Welcome, <strong>{Name}</strong>
                                </span>
                                <span className="fw-semibold text-white">at</span>
                                <span
                                    className={`badge text-white`}
                                    style={{
                                        backgroundColor: selectedSociety?.label ? "#0d6efd" : "#dc3545",
                                        fontSize: "0.9rem",
                                        padding: "6px 12px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    {selectedSociety?.label || "No Society Selected"}
                                    {flatNumber ? ` ( ${flatNumber}  )` : ""}
                                </span>
                            </div>

                            <div className="flex-grow-1 d-none d-lg-block"></div>
                        </div>
                    </nav>

                    <div className={styles.mainContent}>{children}</div>
                </div>
            </div>
        </div>
    );
}
