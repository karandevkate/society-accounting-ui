"use client"
import { BASE_URL } from '@/config/apiConfig';
import axios from 'axios';
import { useRouter } from "next/navigation";
import React, { useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import styles from "@/app/login/page.module.css";
import { KeyFill, PersonFill, TelephoneFill } from 'react-bootstrap-icons';

export default function AdminLogin() {
    const router = useRouter();
    const mobileRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const loginMember = async () => {
        const formData = {
            mobile: mobileRef.current?.value,
            password: passwordRef.current?.value
        };

        try {
            const response = await axios.post(`${BASE_URL}/superadmin/login`, formData);
            toast.success("Member Login Successful!");

            const superAdminID = response.data.superAdminId;
            const superAdminName = response.data.fullName;
            if (typeof window !== "undefined") {
                localStorage.setItem("SuperAdminID", superAdminID);
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("SuperAdminName", superAdminName);
            }
            router.push(`/superadmin/${superAdminID}/dashboard`);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };
    return (
        <div>
            <div className="card mt-3 col-md-4 offset-4" >
                <ToastContainer />
                <div className={`${styles.card} `}>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className={styles.title}>
                            <PersonFill className={styles.titleIcon} /> Sign In
                        </h1>

                        <span className={styles.subtitle}>Use your account</span>
                        <div className={styles.inputGroup}>
                            <TelephoneFill className={styles.icon} />
                            <input
                                ref={mobileRef}
                                type="tel"
                                placeholder="Mobile No"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <KeyFill className={styles.icon} />
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Password"
                            />
                        </div>

                        <a href="#" className={`${styles.link} mb-3`}>
                            Forgot your password?
                        </a>

                        <button type="submit" onClick={() => loginMember()} className={`${styles.button} btn`}>
                            Sign In
                        </button>

                    </div>
                </div>
            </div>
        </div >
    )
}
