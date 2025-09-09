"use client";
import Link from "next/link";
import React from "react";


import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
export const FooterComponent = () => {
    const [showFooter, setshowFooter] = useState(true);
    const pathname = usePathname();

    useEffect(() => {

        if (pathname.startsWith("/superadmin") || pathname.startsWith("/management") || pathname.startsWith("/resident")) {
            setshowFooter(false);
        }
        else {
            setshowFooter(true);
        }
    }, [pathname]);

    if (!showFooter) return null;
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <div className="container text-center">
                <div className="row">
                    {/* Left Section - Brand Name */}
                    <div className="col-md-4 mb-3 border-end border-light">
                        <h5 className="fw-bold text-primary">MySociety</h5>
                        <p className="text-light small">
                            MySociety is your trusted platform for seamless society management. From financial tracking to event management, we simplify community living.
                        </p>
                        <p className="text-light small">
                            Stay organized, connected, and in control with our user-friendly tools designed for housing societies of all sizes.
                        </p>
                    </div>

                    {/* Middle Section - Navigation Links */}
                    <div className="col-md-4 mb-3 border-end border-light">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link href="/" className="text-light text-decoration-none">Home</Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-light text-decoration-none">About</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-light text-decoration-none">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section - Social Media */}
                    <div className="col-md-4">
                        <h5>Follow Us</h5>
                        <div className="d-flex justify-content-center gap-3">
                            <Link href="https://facebook.com" target="_blank" className="text-light">
                                <i className="bi bi-facebook"></i>
                            </Link>
                            <Link href="https://twitter.com" target="_blank" className="text-light">
                                <i className="bi bi-twitter"></i>
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" className="text-light">
                                <i className="bi bi-linkedin"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="mt-3">
                    <p className="small mb-0">© {new Date().getFullYear()} MySociety. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
