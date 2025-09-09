"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BASE_URL, getFlatNumber, getMemberId, getSocietyId, getSocietyMemberId } from "@/config/apiConfig";
import { Card } from "react-bootstrap";
import { Pencil, PersonFill } from "react-bootstrap-icons";
import styles from "@/app/resident/[username]/dashboard/page.module.css";

interface FlatResponseDTO {
    flatNumber: string;
    wing: string;
    flat: string;
    societyId: string;
    societyName: string;
    flatType: string;
    selfOccupied: boolean;
}

const Profile = () => {

    const [flats, setFlats] = useState<FlatResponseDTO[]>([]);
    const [selectedFlatNumber, setSelectedFlatNumber] = useState<string | null>(null);
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 98765 43210",
        society: "BH1234",
    };

    useEffect(() => {
        const storedFlat = getFlatNumber();
        setSelectedFlatNumber(storedFlat);
        fetchFlats();
        fetchProfile();
    }, []);

    const fetchFlats = async () => {
        try {
            const response = await axios.get<FlatResponseDTO[]>(
                `${BASE_URL}/flats/by-society-member/${getSocietyMemberId()}/society/${getSocietyId()}`
            );
            setFlats(response.data);
        } catch (error) {
            console.error("Error fetching flats:", error);
        }
    };


    const [profile, setProfile] = useState<any>({
        memberId: "",
        fullName: "",
        mobile: "",
        email: "",
        alternateMobile: "",
        alternateEmail: "",
        nativeAddress: "",
        nativeMobile: "",
        govId: "",
    });

    const [progress, setProgress] = useState(0);

    const calculateCompletion = (data: any) => {
        const fieldsToCheck = [
            data.memberId,
            data.fullName,
            data.mobile,
            data.email,
            data.alternateMobile,
            data.alternateEmail,
            data.nativeAddress,
            data.nativeMobile,
            data.govId,
        ];
        const filled = fieldsToCheck.filter(
            (val) => val !== null && val !== undefined && val.toString().trim() !== ""
        ).length;
        return Math.round((filled / fieldsToCheck.length) * 100);
    };







    const fetchProfile = async () => {
        try {
            const memberId = getMemberId();
            const response = await fetch(`${BASE_URL}/members/${memberId}`);
            if (!response.ok) throw new Error("Failed to fetch member profile");

            const data = await response.json();

            const updatedProfile = {
                memberId: data.memberId || "",
                fullName: data.fullName || "",
                mobile: data.mobile || "",
                email: data.email || "",
                alternateMobile: data.alternateMobile || "",
                alternateEmail: data.alternateEmail || "",
                nativeAddress: data.nativeAddress || "",
                nativeMobile: data.nativeMobile || "",
                govId: data.govId || "",

            };

            setProfile(updatedProfile);
            setProgress(calculateCompletion(updatedProfile));
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    return (
        <div className="container py-3">
            <h2 className="mb-4 text-primary d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>My Profile
            </h2>

            {/* <div className="card shadow-sm rounded-4 p-4 border-0 mb-3">
                <div className="row">
                    <div className="col-md-8">
                        <h5 className="fw-bold mb-3 text-info">
                            <i className="bi bi-info-circle me-2"></i>Personal Info
                        </h5>
                        <p>
                            <i className="bi bi-person-fill me-2 text-secondary"></i>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <i className="bi bi-envelope-fill me-2 text-secondary"></i>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <i className="bi bi-phone-fill me-2 text-secondary"></i>
                            <strong>Phone:</strong> {user.phone}
                        </p>
                        <p>
                            <i className="bi bi-buildings-fill me-2 text-secondary"></i>
                            <strong>Society:</strong> {user.society}
                        </p>
                    </div>
                    <div className="col-md-4 d-flex justify-content-md-end align-items-start mt-3 mt-md-0">
                        <button className="btn btn-outline-primary rounded-pill px-4">
                            <i className="bi bi-pencil-square me-2"></i>Edit
                        </button>
                    </div>
                </div>
            </div> */}

            <div className="col-md-12 mb-5">
                <Card className="shadow-lg border-0 rounded-4 p-4 bg-white">
                    <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold text-dark mb-0">Profile Completion</h4>
                        <Pencil
                            className="text-primary"
                            size={26}
                            role="button"

                        />
                    </Card.Header>

                    <Card.Body>
                        {/* Donut Progress */}
                        {/* Donut Progress with Profile Image */}
                        {/* Profile Progress Circle */}
                        <div className="d-flex justify-content-center mb-3">
                            <div
                                className={styles["donut-progress"]}
                                style={{ "--progress": `${progress}` } as React.CSSProperties}
                            >
                                <img
                                    src={profile.imageUrl || "/staff.png"}
                                    alt="Profile"
                                    className={styles["profile-avatar"]}
                                />
                                <span className={styles["progress-text"]}>{progress}%</span>
                            </div>
                        </div>


                        {/* Profile Info with Icons */}
                        <div className="mt-3">
                            <p><i className="bi bi-person-fill text-primary me-2"></i><b>Name:</b> {profile.fullName || "Not provided"}</p>
                            <p><i className="bi bi-envelope-fill text-success me-2"></i><b>Email:</b> {profile.email || "Not provided"}</p>
                            <p><i className="bi bi-telephone-fill text-warning me-2"></i><b>Phone:</b> {profile.mobile || "Not provided"}</p>
                        </div>

                        {/* Missing Fields */}
                        {progress < 100 && (
                            <div className="alert alert-warning mt-3 rounded-3 small">
                                <b>Complete your profile:</b> Missing {["Email", "Gov ID"].join(", ")}
                            </div>
                        )}
                    </Card.Body>
                </Card>

            </div>


            <div className="py-0">
                <h5 className="mb-3 text-secondary">Registered Flats</h5>

                <div className="row g-4">
                    {flats.map((flat) => {
                        const isSelected = flat.flatNumber === selectedFlatNumber;
                        return (
                            <div className="col-12 col-sm-6 col-md-4" key={flat.flatNumber}>
                                <div className={`card h-100 shadow-sm rounded-4 p-3 ${isSelected ? "border-primary bg-warning-subtle text-dark" : "border-0"}`}>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold d-flex align-items-center">
                                            <i className="bi bi-house-door-fill me-2 text-success"></i>
                                            {flat.flatNumber}
                                            <span className="badge bg-light text-dark ms-auto border rounded-pill px-2">
                                                {flat.flatType}
                                            </span>
                                        </h5>

                                        <h6 className="card-subtitle text-muted mb-2">
                                            {flat.societyName}
                                        </h6>

                                        <p className="card-text flex-grow-1 mt-3">
                                            <strong>Wing:</strong> {flat.wing}
                                            <br />
                                            <strong>Flat:</strong> {flat.flat}
                                            <br />
                                            <strong>Self Occupied:</strong>{" "}
                                            {flat.selfOccupied ? (
                                                <span className="badge bg-success ms-1">Yes</span>
                                            ) : (
                                                <span className="badge bg-warning text-dark ms-1">No</span>
                                            )}
                                        </p>

                                        {isSelected ? (
                                            <button className="btn btn-outline-primary w-100 mt-auto" disabled>
                                                <i className="bi bi-check-circle me-2"></i>Currently Selected
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline-success w-100 mt-auto"
                                                onClick={() => {
                                                    localStorage.setItem("flatNumber", flat.flatNumber);
                                                    setSelectedFlatNumber(flat.flatNumber);
                                                }}
                                            >
                                                <i className="bi bi-arrow-repeat me-2"></i>Switch to this Flat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Profile;
