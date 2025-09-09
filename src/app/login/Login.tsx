"use client";
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/app/login/page.module.css";
import { ToastContainer, toast } from "react-toastify";
import {
    PersonFill,
    PersonPlusFill,
    TelephoneFill,
    EnvelopeFill,
    HouseDoorFill,
    KeyFill,
    FileEarmarkPersonFill,
} from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const loginMobileRef = useRef<HTMLInputElement>(null);
    const loginPasswordRef = useRef<HTMLInputElement>(null);
    const fullNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();


    useEffect(() => {
        const memberId = localStorage.getItem("memberId");

        if (memberId) {
            router.replace("/management/user/dashboard");
        }
    }, []);
    const hashPassword = async (password: string): Promise<string> => {
        try {
            const trimmedPassword = password.trim();
            const msgBuffer = new TextEncoder().encode(trimmedPassword);
            const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            console.log("Frontend hashed password:", hashHex);
            return hashHex;
        } catch (error) {
            console.error("Hashing error:", error);
            toast.error("Failed to process password.");
            return "";
        }
    };

    const loginMember = async () => {
        const mobile = loginMobileRef.current?.value?.trim() || "";
        const rawPassword = loginPasswordRef.current?.value?.trim() || "";
        const hashedPassword = await hashPassword(rawPassword);

        try {
            const response = await axios.post("http://localhost:8081/auth/login", {
                mobile,
                password: hashedPassword,
            });
            console.log(response.data);
            toast.success("Member Login Successful!");
            const data = response.data;

            if (typeof window !== "undefined") {
                localStorage.setItem("memberId", data.memberId);
                localStorage.setItem("memberRole", data.role);
                localStorage.setItem("memberName", data.fullName);

                if (data.lastVisitedSocietyId) {
                    localStorage.setItem("societyId", data.lastVisitedSocietyId);
                    localStorage.setItem("societyMemberId", data.societyMemberId);
                    const lastSociety = data.societies?.find(
                        (s: any) => s.societyId === data.lastVisitedSocietyId
                    );
                    if (lastSociety) {
                        localStorage.setItem("societyName", lastSociety.societyName);
                    }
                } else if (data.societies && data.societies.length === 1) {
                    localStorage.setItem("societyId", data.societies[0].societyId);
                    localStorage.setItem("societyName", data.societies[0].societyName);
                }

                if (data.lastVisitedFlatNumber) {
                    localStorage.setItem("flatNumber", data.lastVisitedFlatNumber);
                    localStorage.setItem("flatSocietyId", data.lastVisitedSocietyId);
                } else {
                    localStorage.removeItem("flatNumber");
                    localStorage.removeItem("flatSocietyId");
                }
            }

            if (!data.role) {
                router.push("/resident/${data.memberId}/my-flats");
            } else if (data.role.toUpperCase() === "ADMIN") {
                router.push(`/management/${data.memberId}/dashboard`);
            } else {
                router.push(`/resident/${data.memberId}/dashboard`);
            }


        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };


    const registerMember = async () => {
        const rawPassword = passwordRef.current?.value?.trim() || "";
        const hashedPassword = await hashPassword(rawPassword);

        const formData = {
            mobile: mobileRef.current?.value.trim(),
            fullName: fullNameRef.current?.value.trim() || "",
            email: emailRef.current?.value.trim() || "",
            password: hashedPassword
        };

        try {
            const response = await axios.post("http://localhost:8081/auth/signup", formData);
            toast.success("Member Register Successful!");
            setIsSignupSuccess(true);
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error("Member Registration failed. Please try again.");
        }
    }

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <button
                className={`${styles.mobileToggle} d-md-none`}
                onClick={() => {
                    setIsLogin(!isLogin);
                }}
            >
                {isLogin ? "Switch to Sign Up" : "Switch to Sign In"}
            </button>
            <div className={`${styles.container} ${!isLogin ? styles.rightPanelActive : ""}`}>
                <div className={`${styles.formContainer} ${styles.signUpContainer}`} id="registerpage">
                    <div className={`${styles.card}  ${styles.signupcard}`}>
                        <div className="d-flex flex-column align-items-center">
                            {!isSignupSuccess ? (
                                <>
                                    <h1 className={styles.title}>
                                        <PersonPlusFill className={styles.titleIcon} /> Create Account
                                    </h1>
                                    <span className={styles.subtitle}>Use your email to register</span>

                                    <div className={styles.scrollContainer}>
                                        <div className={styles.inputGroup}>
                                            <PersonFill className={styles.icon} />
                                            <input ref={fullNameRef} type="text" placeholder="Name" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <TelephoneFill className={styles.icon} />
                                            <input ref={mobileRef} type="text" placeholder="Mobile No" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <EnvelopeFill className={styles.icon} />
                                            <input ref={emailRef} type="text" placeholder="Email" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <KeyFill className={styles.icon} />
                                            <input ref={passwordRef}
                                                type={showSignupPassword ? "text" : "password"}
                                                placeholder="Password" />
                                            <i
                                                className={`bi ${showSignupPassword ? "bi-eye-slash" : "bi-eye"} ${styles.icon}`}
                                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                            ></i>
                                        </div>
                                    </div>

                                    <button type="submit" onClick={() => registerMember()} className={`${styles.button} btn`}>Sign Up</button>


                                </>
                            ) : (
                                <div className={`${styles.emailCard}`}>

                                    <h3>        <i className="bi bi-envelope-check-fill text-success me-2"></i>
                                        Email Sent!</h3>
                                    <p>Please check your registered email to verify your account.</p>
                                </div>

                            )}
                        </div>
                    </div>
                </div>


                <div className={`${styles.formContainer} ${styles.signInContainer} d-flex justify-content-center`} id="loginpage">
                    <div className={`${styles.card} `}>
                        <div className="d-flex flex-column align-items-center">
                            <h1 className={styles.title}>
                                <PersonFill className={styles.titleIcon} /> Sign In
                            </h1>

                            <span className={styles.subtitle}>Use your account</span>
                            <div className={styles.inputGroup}>
                                <TelephoneFill className={styles.icon} />
                                <input
                                    ref={loginMobileRef}
                                    type="tel"
                                    placeholder="Mobile No"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <KeyFill className={styles.icon} />
                                <input
                                    ref={loginPasswordRef}
                                    type={showLoginPassword ? "text" : "password"}
                                    placeholder="Password"
                                />

                                <i
                                    className={`bi ${showLoginPassword ? "bi-eye-slash" : "bi-eye"} ${styles.icon}`}
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                ></i>

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

                <div className={styles.overlayContainer}>
                    <div className={styles.overlay} >
                        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`} >
                            <h1 className={styles.title}>Welcome Back!</h1>
                            <p className={styles.overlayText}>
                                Login with your personal info to stay connected
                            </p>
                            <button
                                type="button"
                                className={`${styles.overlaybutton} btn`}
                                onClick={() => {
                                    setIsLogin(true)
                                    setIsSignupSuccess(false);
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className={`${styles.overlayPanel} ${styles.overlayRight}`} >
                            <h1 className={styles.title}>Hello, Friend!</h1>
                            <p className={styles.overlayText}>
                                Start your journey by entering your details
                            </p>
                            <button
                                type="button"
                                className={`${styles.overlaybutton} btn`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}