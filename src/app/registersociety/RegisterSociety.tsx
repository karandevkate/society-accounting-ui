
"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import styles from "@/app/registersociety/page.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import { BASE_URL } from "@/config/apiConfig";

export default function RegisterSociety() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    const refs = {
        fullName: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        altEmail: useRef<HTMLInputElement>(null),
        mobile: useRef<HTMLInputElement>(null),
        altMobile: useRef<HTMLInputElement>(null),
        nativeAddress: useRef<HTMLTextAreaElement>(null),
        nativeMobile: useRef<HTMLInputElement>(null),
        govId: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
        societyName: useRef<HTMLInputElement>(null),
        registrationNumber: useRef<HTMLInputElement>(null),
        detailedAddress: useRef<HTMLInputElement>(null),
        pincode: useRef<HTMLInputElement>(null),
        landmark: useRef<HTMLInputElement>(null),
        zone: useRef<HTMLInputElement>(null),
        state: useRef<HTMLInputElement>(null),
        city: useRef<HTMLInputElement>(null),
    };

    const hashPassword = async (password: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(password.trim());
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };

    const handleSaveAndNext = () => {
        const mobile = refs.mobile.current?.value.trim();
        const altMobile = refs.altMobile.current?.value.trim();
        const email = refs.email.current?.value.trim();
        const altEmail = refs.altEmail.current?.value.trim();

        if (!mobile) return toast.error("Mobile number is required");
        if (mobile === altMobile && altMobile)
            return toast.error("Alternate Mobile must differ");
        if (email && email === altEmail)
            return toast.error("Alternate Email must differ");

        setIsFlipped(true);
    };

    const handleBack = () => setIsFlipped(false);

    const submitSociety = async () => {
        setLoading(true);
        const password = refs.password.current?.value.trim();
        if (!password) {
            toast.error("Password is required");
            setLoading(false);
            return;
        }

        const hashedPassword = await hashPassword(password);

        const requiredFields = [
            ["societyName", "Society Name"],
            ["registrationNumber", "Registration No"],
            ["detailedAddress", "Detailed Address"],
            ["state", "State"],
            ["city", "City"],
            ["pincode", "Pincode"],
        ];

        for (let [key, label] of requiredFields) {
            const val = refs[key as keyof typeof refs]?.current?.value.trim();
            if (!val) {
                toast.error(`${label} is required`);
                setLoading(false);
                return;
            }
        }

        const formData: Record<string, string> = {};
        for (const [key, ref] of Object.entries(refs)) {
            formData[key] = ref.current?.value.trim() || "";
        }
        formData.password = hashedPassword;

        try {
            await axios.post(`${BASE_URL}/society/registersociety`, formData);
            toast.success("Society Registered Successfully");
            clearForm();
            setIsFlipped(false);
        } catch {
            toast.error("Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () =>
        Object.values(refs).forEach((ref) => ref.current && (ref.current.value = ""));

    return (
        <div className={styles.pageWrapper}>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className={styles.container}>
                <div className={`${styles.flipCard} ${isFlipped ? styles.flipped : ""}`}>
                    <div className={styles.flipCardInner}>
                        {/* FRONT CARD */}
                        <div className={styles.flipCardFront}>
                            <h3 className={styles.cardTitle}>Admin Registration</h3>
                            <form className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name *</label>
                                    <input ref={refs.fullName} className={styles.input} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email *</label>
                                        <input ref={refs.email} type="email" className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Alternate Email</label>
                                        <input
                                            ref={refs.altEmail}
                                            type="email"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Mobile *</label>
                                        <input ref={refs.mobile} type="tel" className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Alternate Mobile</label>
                                        <input
                                            ref={refs.altMobile}
                                            type="tel"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Native Address *</label>
                                    <textarea
                                        ref={refs.nativeAddress}
                                        rows={3}
                                        className={styles.textarea}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Native Mobile *</label>
                                        <input
                                            ref={refs.nativeMobile}
                                            type="tel"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Government ID *</label>
                                        <input ref={refs.govId} type="text" className={styles.input} />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Password *</label>
                                    <input
                                        ref={refs.password}
                                        type="password"
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                    onClick={handleSaveAndNext}
                                >
                                    Save and Next
                                </button>
                            </form>
                        </div>

                        {/* BACK CARD */}
                        <div className={styles.flipCardBack}>
                            <div className={styles.cardHeader} >
                                <h3 className={styles.cardTitle} >Society Registration</h3>
                            </div>
                            <form className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Society Name *</label>
                                    <input ref={refs.societyName} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Registration No *</label>
                                    <input ref={refs.registrationNumber} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Detailed Address *</label>
                                    <input ref={refs.detailedAddress} className={styles.input} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>State *</label>
                                        <input ref={refs.state} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>City *</label>
                                        <input ref={refs.city} className={styles.input} />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Pincode *</label>
                                        <input ref={refs.pincode} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Zone</label>
                                        <input ref={refs.zone} className={styles.input} />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Landmark</label>
                                    <input ref={refs.landmark} className={styles.input} />
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.successButton}
                                        onClick={submitSociety}
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}