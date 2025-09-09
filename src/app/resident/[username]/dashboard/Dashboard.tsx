"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import styles from "@/app/resident/[username]/dashboard/page.module.css";
import global from "@/app/resident/user.module.css";
import { getFlatNumber, getMemberId, BASE_URL } from "@/config/apiConfig";
import { useRouter } from "next/navigation";

export default function ResidentDashboard() {
  const router = useRouter();

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

  const sendToProfilePage = () => {
    router.push(`/resident/${getMemberId()}/profile`);
  };

  function getInitials(name: string = ""): string {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); // Max 2 letters
  }

  function getRandomColor(seed: string = ""): string {
    const colors = [
      "#6c5ce7", // Purple
      "#00b894", // Green
      "#e17055", // Orange
      "#fdcb6e", // Yellow
      "#d63031", // Red
      "#74b9ff", // Light Blue — REMOVED
      "#55efc4", // Aqua
      "#fab1a0", // Light Pink
      "#ffeaa7", // Cream
      "#636e72", // Grey
      "#b2bec3", // Light Grey
      "#a29bfe", // Lavender
      "#00cec9", // Teal
      "#ff7675", // Light Red
      "#e84393", // Pink
      "#2d3436", // Dark Gray
      "#fd79a8", // Bright Pink
      "#badc58", // Lime Green
      "#f0932b", // Dark Orange
      "#e056fd"  // Soft Purple
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }


  useEffect(() => {


    fetchProfile();
  }, []);

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
  function getMissingFields(data: any): string[] {
    const requiredFields = {
      email: "Email",
      mobile: "Phone",
      fullName: "Name",
      govId: "Gov ID",
      nativeAddress: "Native Address",
      nativeMobile: "Native Mobile",
      alternateEmail: "Alternate Email",
      alternateMobile: "Alternate Phone",
    };

    return Object.entries(requiredFields).filter(([key]) => {
      const value = data[key];
      return !value || value.toString().trim() === "";
    }).map(([, label]) => label);
  }

  return (
    <div className="container mt-5 row">
      {/* Profile Completion Card */}
      <div className="col-md-6">
        <Card className="shadow-lg border-0 rounded-4 p-4 bg-white">
          <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold text-dark mb-0">Profile Completion</h4>
            <PersonFill
              className="text-primary"
              size={26}
              role="button"
              onClick={sendToProfilePage}
            />
          </Card.Header>

          <Card.Body>
            <div className="d-flex justify-content-start align-items-center mb-3 gap-4 flex-wrap">
              {/* Avatar / Progress Circle */}
              <div
                className={styles["donut-progress"]}
                style={{ "--progress": `${progress}` } as React.CSSProperties}
              >
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt="Profile"
                    className={styles["profile-avatar"]}
                  />
                ) : (
                  <div
                    className={`${styles["profile-avatar"]} ${styles["initials-avatar"]}`}
                    style={{ backgroundColor: getRandomColor(profile.fullName) }}
                  >
                    {getInitials(profile.fullName)}
                  </div>
                )}
                <span className={styles["progress-text"]}>{progress}%</span>
              </div>

              {/* Profile Info */}
              <div>
                <p>
                  <i className="bi bi-person-fill text-primary me-2"></i>
                  <b>Name:</b> {profile.fullName || "Not provided"}
                </p>
                <p>
                  <i className="bi bi-envelope-fill text-success me-2"></i>
                  <b>Email:</b> {profile.email || "Not provided"}
                </p>
                <p>
                  <i className="bi bi-telephone-fill text-warning me-2"></i>
                  <b>Phone:</b> {profile.mobile || "Not provided"}
                </p>
              </div>
            </div>

            {/* Missing Fields Warning */}
            {progress < 100 && (
              <div className="alert alert-warning mt-3 rounded-3 small">
                <b>Complete your profile:</b> Missing {getMissingFields(profile).join(", ")}
              </div>
            )}
          </Card.Body>


        </Card>

      </div>

      <div className="col-md-6">
        <div className={global["container"]}>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6">
              <div
                className={`${styles["card-custom"]} ${styles["card-custom-1"]} card`}
              >
                <div className="card-body">
                  <h5 className="card-title">Maintenance Payments</h5>
                  <h4>{0}</h4>
                  <p className="card-content">Pending payments for this year</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6">
              <div
                className={`${styles["card-custom"]} ${styles["card-custom-2"]} card`}
              >
                <div className="card-body">
                  <h5 className="card-title">Society Notices</h5>
                  <h4>{0}</h4>
                  <p className="card-content">Unread notices</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-6 col-md-6">
              <div
                className={`${styles["card-custom"]} ${styles["card-custom-3"]} card`}
              >
                <div className="card-body">
                  <h5 className="card-title">Open Complaints</h5>
                  <h4>{0}</h4>
                  <p className="card-content">Complaints awaiting resolution</p>
                </div>
              </div>
            </div>

            {/* Resolved Complaints */}
            <div className="col-12 col-sm-6 col-md-6">
              <div
                className={`${styles["card-custom"]} ${styles["card-custom-4"]} card`}
              >
                <div className="card-body">
                  <h5 className="card-title">Resolved Complaints</h5>
                  <h4>{0}</h4>
                  <p className="card-content">Complaints resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
