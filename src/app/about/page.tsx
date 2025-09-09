import React from 'react';
import styles from '@/app/about/page.module.css';
import Link from 'next/link';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "About",
};
export default function About() {
    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">About <span className="text-success">MySociety</span></h2>
                <p className="lead text-secondary">Empowering communities with seamless society management solutions.</p>
            </div>

            <div className="d-flex flex-wrap gap-4 justify-content-center">
                {/* Who We Are Section */}
                <div className={`${styles.cardHover} card shadow-lg p-4 border-0 rounded-4`} style={{ width: '30rem' }}>
                    <h4 className="text-success fw-bold">Who We Are</h4>
                    <p className="text-muted">
                        At <strong>MySociety</strong>, we are dedicated to revolutionizing the way residential societies operate.
                        Our platform provides an all-in-one solution for seamless community management, helping residents,
                        committees, and staff stay connected and organized.
                    </p>
                </div>

                {/* Our Mission Section */}
                <div className={`${styles.cardHover} card shadow-lg p-4 border-0 rounded-4`} style={{ width: '30rem' }}>
                    <h4 className="text-success fw-bold">Our Mission</h4>
                    <p className="text-muted">
                        Our mission is to enhance the living experience in gated communities by providing efficient tools for
                        <strong> maintenance collection, staff management, visitor tracking, complaint resolution</strong>, and more.
                        We believe in fostering a hassle-free, transparent, and secure environment for residents.
                    </p>
                </div>

                {/* Why Choose MySociety */}
                <div className={`${styles.cardHover} card shadow-lg p-4 border-0 rounded-4`} style={{ width: '30rem' }}>
                    <h4 className="text-success fw-bold">Why Choose MySociety?</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item border-0"><span className="text-primary fw-bold">✅</span> Easy-to-use platform for residents & management</li>
                        <li className="list-group-item border-0"><span className="text-primary fw-bold">✅</span> Automated maintenance fee collection</li>
                        <li className="list-group-item border-0"><span className="text-primary fw-bold">✅</span> Secure visitor & staff tracking</li>
                        <li className="list-group-item border-0"><span className="text-primary fw-bold">✅</span> Instant communication within the society</li>
                        <li className="list-group-item border-0"><span className="text-primary fw-bold">✅</span> Robust complaint resolution system</li>
                    </ul>
                </div>

                {/* Call to Action */}
                <div className={`${styles.cardHover} card shadow-lg p-4 border-0 rounded-4 text-center`} style={{ width: '30rem' }}>
                    <h4 className="fw-bold text-success">Join Us</h4>
                    <p className="text-muted">
                        Experience the future of society management with <strong>MySociety</strong>. Whether you're a resident or
                        a managing committee member, our platform makes society operations smooth and hassle-free.
                    </p>
                    <Link href="/registersociety">   <button className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-3">Get Started</button></Link>
                </div>
            </div>
        </div>
    );
}   