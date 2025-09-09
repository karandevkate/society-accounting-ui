"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import tableStyles from "@/app/css/table.module.css";
import { Card } from "react-bootstrap";
export default function MemberRequest() {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);

    useEffect(() => {
        getMember();
    }, []);


    const getMember = () => {
        axios
            .get(`${BASE_URL}/api/members/pending/${getSocietyId()}`, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                const normalized = response.data.map((m: any) => ({
                    ...m,
                    status:
                        m.status === true
                            ? "APPROVED"
                            : m.status === "REJECTED"
                                ? "REJECTED"
                                : "PENDING",
                }));
                setMembers(normalized);
            })
            .catch((error) => {
                console.error("Error fetching members:", error);
            });
    };

    // Approve member
    const handleApprove = (societyMemberId: string) => {
        axios
            .put(
                `${BASE_URL}/api/admin/approve-member/${societyMemberId}`,
                { role: "MEMBER" },
                { headers: { "Content-Type": "application/json" } }
            )
            .then(() => {
                setMembers((prevMembers) =>
                    prevMembers.map((m) =>
                        m.societyMemberId === societyMemberId
                            ? { ...m, status: "APPROVED" }
                            : m
                    )
                );
            })
            .catch((err) => console.error("Error approving member:", err));
    };

    // Reject member
    const handleReject = (societyMemberId: string) => {
        axios
            .put(
                `${BASE_URL}/api/admin/reject-member/${societyMemberId}`,
                { role: "MEMBER" },
                { headers: { "Content-Type": "application/json" } }
            )
            .then(() => {
                setMembers((prevMembers) =>
                    prevMembers.map((m) =>
                        m.societyMemberId === societyMemberId
                            ? { ...m, status: "REJECTED" }
                            : m
                    )
                );
            })
            .catch((err) => console.error("Error rejecting member:", err));
    };

    const openModal = (member: any) => {
        setSelectedMember(member);
    };

    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Member Requests</h2>
            <Card className={tableStyles.card} >
                <Card.Body>
                    <div className={tableStyles.tableWrapper}>
                        <table className={tableStyles.customTable} >
                            <thead className={tableStyles.tableHead}>
                                <tr>
                                    <th>Property No.</th>
                                    <th>Owner Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr key={member.societyMemberId}>
                                            <td>{member.flatNumber}</td>
                                            <td>{member.memberName}</td>
                                            <td>{member.role}</td>
                                            <td>
                                                {member.status === "APPROVED" && (
                                                    <span className="badge bg-success">
                                                        Approved
                                                    </span>
                                                )}
                                                {member.status === "REJECTED" && (
                                                    <span className="badge bg-danger">
                                                        Rejected
                                                    </span>
                                                )}
                                                {member.status === "PENDING" && (
                                                    <span className="badge bg-warning text-dark">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {member.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm me-2"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    member.societyMemberId
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                handleReject(
                                                                    member.societyMemberId
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {member.status === "APPROVED" && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleReject(
                                                                member.societyMemberId
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                {member.status === "REJECTED" && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() =>
                                                            handleApprove(
                                                                member.societyMemberId
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-info btn-sm ms-2"
                                                    onClick={() => openModal(member)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            No members Pending
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body >
            </Card >
            {selectedMember && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Member Details</h5>
                                <div
                                    className="btn btn-danger close"
                                    onClick={closeModal}
                                    style={{
                                        color: "black",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    X
                                </div>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>Full Name:</strong>{" "}
                                    {selectedMember.memberName}
                                </p>
                                <p>
                                    <strong>Mobile:</strong>{" "}
                                    {selectedMember.mobile}
                                </p>
                                <p>
                                    <strong>Alternate Mobile:</strong>{" "}
                                    {selectedMember.alternateMobile}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedMember.email}
                                </p>
                                <p>
                                    <strong>Alternate Email:</strong>{" "}
                                    {selectedMember.alternateEmail}
                                </p>
                                <p>
                                    <strong>Native Address:</strong>{" "}
                                    {selectedMember.nativeAddress}
                                </p>
                                <p>
                                    <strong>Gov ID:</strong>{" "}
                                    {selectedMember.govId}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-danger"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
