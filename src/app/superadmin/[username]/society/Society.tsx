"use client";
import React, { useEffect, useState } from "react";
import global from "@/app/superadmin/superadmin.module.css";
import styles from "@/app/superadmin/[username]/society/page.module.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { PencilSquare } from "react-bootstrap-icons";
import { Button, Card, Modal } from "react-bootstrap";
import { BASE_URL } from "@/config/apiConfig";

export default function Society() {
    const [societies, setSocieties] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [viewSocietyDetails, setViewSocietyDetails] = useState<any>(null);

    useEffect(() => {
        fetchAllSociety();
    }, []);

    const fetchAllSociety = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/society/getAllSocieties`);
            setSocieties(response.data);
        } catch (err: any) {
            toast.error("Error fetching societies: " + err.message);
        }
    };

    const handleToggleStatus = async (society: any) => {
        try {
            if (society.status === "APPROVED") {
                await axios.put(`${BASE_URL}/society/${society.societyId}/reject`);
                toast.error("Society rejected successfully!");
            } else {
                await axios.put(`${BASE_URL}/society/${society.societyId}/approve`);
                toast.success("Society approved successfully!");
            }
            fetchAllSociety();
        } catch (error) {
            toast.error("Failed to change society status");
        }
    };

    const viewSociety = async (societyId: number) => {
        setShowModal(true);
        try {
            const response = await axios.get(`${BASE_URL}/society/${societyId}/with-admins`);
            setViewSocietyDetails(response.data);
        } catch (err: any) {
            toast.error("Error fetching society details: " + err.message);
        }
    };

    const handleApproveAdmin = async (societyMemberId: string) => {
        try {
            await axios.put(`${BASE_URL}/api/admin/approve-member/${societyMemberId}`, {
                role: "ADMIN",
            });
            toast.success("Admin approved successfully!");
            const response = await axios.get(`${BASE_URL}/society/${viewSocietyDetails.societyId}/with-admins`);
            setViewSocietyDetails(response.data);
        } catch (err: any) {
            toast.error("Failed to approve admin: " + err.message);
        }
    };
    const handleRejectAdmin = async (societyMemberId: string) => {
        try {
            await axios.put(`${BASE_URL}/api/admin/reject-member/${societyMemberId}`, {
                role: "ADMIN",
            });
            toast.success("Admin rejected successfully!");
            const response = await axios.get(`${BASE_URL}/society/${viewSocietyDetails.societyId}/with-admins`);
            setViewSocietyDetails(response.data);
        } catch (err: any) {
            toast.error("Failed to reject admin: " + err.message);
        }
    };


    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className={`${global.container} p-3 bg-light min-vh-100`}>
            <ToastContainer />
            <h2 className={global["heading"]}>Society</h2>
            <div className="row">
                <div className="col-md-12">
                    <Card className={styles.card}>
                        <Card.Body>
                            <div className={styles.tableWrapper}>
                                <table className={`table ${styles.customTable}`}>
                                    <thead className={styles.tableHead}>
                                        <tr>
                                            <th>SrNo</th>
                                            <th>Society Name</th>
                                            <th>City - State</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {societies.map((society, index) => (
                                            <tr key={society.societyId}>
                                                <td>{index + 1}</td>
                                                <td>{society.societyName}</td>
                                                <td>{society.city} - {society.state}</td>
                                                <td className={styles.statusCell}>
                                                    <label className={styles.switch}>
                                                        <input
                                                            type="checkbox"
                                                            checked={society.status === "APPROVED"}
                                                            onChange={() => handleToggleStatus(society)}
                                                        />
                                                        <span className={`${styles.slider} ${styles.round}`}></span>
                                                    </label>
                                                    <span className={styles.statusText}>{society.status}</span>
                                                </td>
                                                <td>
                                                    <PencilSquare
                                                        className="text-primary"
                                                        size={24}
                                                        role="button"
                                                        onClick={() => viewSociety(society.societyId)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Society Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewSocietyDetails && (
                        <div className="container">
                            {/* Admin Information */}
                            <div className="row">
                                {viewSocietyDetails.societyAdminDto?.map((admin: any, index: number) => (
                                    <div key={index} className="col-md-6">
                                        <Card className="mb-4 shadow-sm border-0 rounded-lg">
                                            <Card.Body>
                                                <h5 className="text-primary fw-bold mb-3">Admin Information</h5>
                                                <p className="text-secondary"><strong>Admin Name:</strong> {admin.fullName}</p>
                                                <p className="text-secondary"><strong>Email:</strong> {admin.email}</p>
                                                <p className="text-secondary"><strong>Mobile:</strong> {admin.mobile}</p>
                                                <p className="text-secondary d-flex align-items-center justify-content-between">
                                                    <span>
                                                        <strong>Status:</strong>
                                                        {admin.status === "APPROVED" ? (
                                                            <span className="text-success fw-bold"> &nbsp;{admin.status}</span>
                                                        ) : admin.status === "AUTOAPPROVED" ? (
                                                            <span className="text-warning fw-bold"> &nbsp;{admin.status}</span>
                                                        ) : (
                                                            <span className="text-danger fw-bold"> &nbsp;{admin.status}</span>
                                                        )}
                                                    </span>

                                                    {/* Action Buttons */}
                                                    <div className="d-flex gap-2">
                                                        {admin.status === "AUTOAPPROVED" && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleApproveAdmin(admin.societyMemberId)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => handleRejectAdmin(admin.societyMemberId)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}

                                                        {admin.status === "APPROVED" && (
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleRejectAdmin(admin.societyMemberId)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        )}

                                                        {admin.status === "REJECTED" && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleApproveAdmin(admin.societyMemberId)}
                                                                >
                                                                    Approve
                                                                </Button>

                                                            </>
                                                        )}
                                                    </div>
                                                </p>


                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            {/* General Information */}
                            <Card className="mb-4 shadow-sm border-0 rounded-lg">
                                <Card.Body>
                                    <h5 className="text-primary fw-bold mb-3">General Information</h5>
                                    <div className="row text-secondary">
                                        <div className="col-md-4"><p><strong>Society Name:</strong> {viewSocietyDetails.societyName}</p></div>
                                        <div className="col-md-4"><p><strong>Registration Number:</strong> {viewSocietyDetails.registrationNumber}</p></div>
                                        <div className="col-md-4"><p><strong>Status:</strong>
                                            {viewSocietyDetails.status === "APPROVED" ? (
                                                <span className="text-success fw-bold"> &nbsp;{viewSocietyDetails.status}</span>
                                            ) : (
                                                <span className="text-danger fw-bold"> &nbsp;{viewSocietyDetails.status}</span>
                                            )}
                                        </p></div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Location Details */}
                            <Card className="mb-4 shadow-sm border-0 rounded-lg">
                                <Card.Body>
                                    <h5 className="text-primary fw-bold mb-3">Location Details</h5>
                                    <div className="row text-secondary">
                                        <div className="col-md-6"><p><strong>Address:</strong> {viewSocietyDetails.detailedAddress}</p></div>
                                        <div className="col-md-6"><p><strong>City:</strong> {viewSocietyDetails.city}</p></div>
                                        <div className="col-md-6"><p><strong>State:</strong> {viewSocietyDetails.state}</p></div>
                                        <div className="col-md-6"><p><strong>Zone:</strong> {viewSocietyDetails.zone}</p></div>
                                        <div className="col-md-6"><p><strong>Landmark:</strong> {viewSocietyDetails.landmark}</p></div>
                                        <div className="col-md-6"><p><strong>Pincode:</strong> {viewSocietyDetails.pincode}</p></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
