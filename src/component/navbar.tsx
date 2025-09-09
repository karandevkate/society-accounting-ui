"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


import { usePathname } from "next/navigation";
export const NavbarComponent = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showNavbar, setshowNavbar] = useState(true);
    const pathname = usePathname();

    useEffect(() => {

        if (pathname.startsWith("/superadmin") || pathname.startsWith("/management") || pathname.startsWith("/resident")) {
            setshowNavbar(false);
        }
        else {
            setshowNavbar(true);
        }
    }, [pathname]);

    if (!showNavbar) return null;
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{ zIndex: "10" }}>
            <div className="container">
                {/* Navbar Brand */}
                <Link href="/" className="navbar-brand fw-bold text-primary">
                    <Image
                        alt=""
                        src={"/logo.png"}
                        height={40}
                        width={40}
                    />
                    &nbsp;
                    MySociety
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link href="/" className="nav-link fw-medium text-dark">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/about" className="nav-link fw-medium text-dark">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/contact" className="nav-link fw-medium text-dark">
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/login" className="btn btn-primary px-4 py-2">
                                Login / Signup
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarComponent;
