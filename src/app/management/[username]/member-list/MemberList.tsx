"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import { Card } from "react-bootstrap";
import tableStyles from "@/app/css/table.module.css";
export default function MembersList() {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);

    useEffect(() => {
        getMember();
    }, []);

    const getMember = () => {
        axios
            .get(`${BASE_URL}/api/members/approved/${getSocietyId()}`, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                setMembers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching members:", error);
            });
    };

    const openModal = (member: any) => {
        setSelectedMember(member);
    };

    const closeModal = () => {
        setSelectedMember(null);
    };

    const toggleStatus = (memberId: number, currentStatus: string) => {
        if (currentStatus === "PENDING") {
            axios
                .put(`http://localhost:8081/members/approve/${memberId}`, {}, {
                    headers: { "Content-Type": "application/json" },
                })
                .then((response) => {
                    setMembers((prevMembers) =>
                        prevMembers.map((member) =>
                            member.memberId === memberId
                                ? { ...member, status: "APPROVED" }
                                : member
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error approving member:", error);
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Registered Members Lists</h2>
            <Card className={tableStyles.card} >
                <Card.Body>
                    <div className={tableStyles.tableWrapper}>
                        <table className={tableStyles.customTable} >
                            <thead className={tableStyles.tableHead}>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Owner Name</th>
                                    <th>Property No</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr key={member.memberId}>
                                            <td>{index + 1}</td>
                                            <td>{member.memberName}</td>
                                            <td>{member.flatNumber}</td>
                                            <td>{member.role}</td>
                                            <td>
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => openModal(member)}>
                                                    View
                                                </button>&nbsp;

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            No members found
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
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content shadow-lg border-0 rounded-3">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">
                                    <span className="bi bi-person"></span> Member Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={closeModal}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="fw-bold mb-0">{selectedMember.memberName}</h4>
                                    <span className={`badge ${selectedMember.status ? "bg-success" : "bg-warning text-dark"}`}>
                                        {selectedMember.status ? "APPROVED" : "PENDING"}
                                    </span>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p><strong>Mobile:</strong> {selectedMember.mobile || "-"}</p>
                                            <p><strong>Alternate Mobile:</strong> {selectedMember.alternateMobile || "-"}</p>
                                            <p><strong>Email:</strong> {selectedMember.email || "-"}</p>
                                            <p><strong>Alternate Email:</strong> {selectedMember.alternateEmail || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p><strong>Flat:</strong> {selectedMember.flatNumber} ({selectedMember.flatType})</p>
                                            <p><strong>Wing:</strong> {selectedMember.wing}</p>
                                            <p><strong>Self Occupied:</strong> {selectedMember.selfOccupied ? "Yes" : "No"}</p>
                                            <p><strong>Registration No:</strong> {selectedMember.registrationNumber}</p>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p><strong>Native Address:</strong> {selectedMember.nativeAddress || "N/A"}</p>
                                            <p><strong>Gov ID:</strong> {selectedMember.govId || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
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