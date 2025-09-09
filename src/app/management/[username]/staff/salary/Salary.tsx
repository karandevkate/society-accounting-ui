"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, Modal } from "react-bootstrap";
import styles from "@/app/management/[username]/staff/salary/page.module.css";
import tableStyles from "@/app/css/table.module.css"
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Salary() {
    const [salaryList, setSalaryList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [salaryDetails, setSalaryDetails] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    const staffIdRef = useRef<HTMLSelectElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const transactionIdRef = useRef<HTMLInputElement>(null);
    const paymentDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSalaryList();
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/staff/${getSocietyId()}`);
            setStaffList(response.data);
        } catch (error: any) {
            console.error("Failed to fetch staff list:", error);
            toast.error("Failed to load staff list.");
        }
    };

    const fetchSalaryList = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/staff/${getSocietyId()}/staffSalary`);
            setSalaryList(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch salary list:", error);
            toast.error("Failed to load salary records.");
        }
    };

    const handlePaySalary = async () => {
        const staffId = staffIdRef.current?.value;
        const amount = amountRef.current?.value;
        const paymentDate = paymentDateRef.current?.value;

        if (!staffId) return toast.error("Please select a staff member.");
        if (!amount || parseFloat(amount) <= 0) return toast.error("Please enter a valid amount.");
        if (!paymentDate) return toast.error("Please select a payment date.");

        const formData = {
            staffId,
            amount: parseFloat(amount),
            transactionId: transactionIdRef.current?.value || "",
            paymentDate: new Date(paymentDate).toISOString(),
            description: descriptionRef.current?.value || "",
            societyId: getSocietyId(),
        };

        setIsAdding(true);
        try {
            const response = await axios.post(`${BASE_URL}/staff/staffSalary`, formData);
            toast.success(response.data);
            setShowAddModal(false);
            fetchSalaryList(); // Refresh list after adding
        } catch (error: any) {
            console.error("Failed to pay salary:", error);
            const msg = error?.response?.data?.message || error?.message || "Salary payment failed.";
            toast.error(msg);
        } finally {
            setIsAdding(false);
        }
    };

    const viewSalary = async (salaryId: string) => {
        // try {
        //     const response = await axios.get(`${BASE_URL}/staff/salary/${salaryId}`);
        //     setSalaryDetails(response.data);
        //     setShowViewModal(true);
        // } catch (error) {
        //     toast.error("Failed to fetch salary details.");
        // }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={tableStyles.headerSection}>
                <h2>Staff Salaries</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                    style={{ backgroundColor: "#0078d7", borderColor: "#2980b9", padding: "12px" }}
                >
                    Add Salary
                </button>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <Card className={tableStyles.card}>
                        <Card.Body>
                            <div className={tableStyles.tableWrapper}>
                                <table className={tableStyles.customTable}>
                                    <thead className={tableStyles.tableHead}>
                                        <tr>
                                            <th>SrNo</th>
                                            <th>Staff Name</th>
                                            <th>Contact</th>
                                            <th>Email</th>
                                            <th>Amount</th>
                                            <th>Payment Date</th>
                                            <th>Transaction ID</th>
                                            <th>Description</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaryList.map((salary, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{salary.name || "N/A"}</td>
                                                <td>{salary.contact || "N/A"}</td>
                                                <td>{salary.email || "N/A"}</td>
                                                <td>₹{salary.amount?.toLocaleString() || "0"}</td>
                                                <td>
                                                    {salary.paymentDate
                                                        ? new Date(salary.paymentDate).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                                <td>{salary.transactionId || "N/A"}</td>
                                                <td>{salary.description || "N/A"}</td>
                                                {/* <td>
                                                    <PencilSquare
                                                        className={`${styles.actionIcon} text-primary`}
                                                        size={24}
                                                        role="button"
                                                        onClick={() => viewSalary(salary.salaryId)}
                                                    />
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Add Salary Modal */}
            {showAddModal && (
                <div className="modal show" style={{ display: "block" }} tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Salary</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                ></button>
                            </div>
                            <div className={styles.modalContent}>
                                <div className="form-group mb-3">
                                    <label htmlFor="staffId" className="form-label">Staff</label>
                                    <select ref={staffIdRef} id="staffId" className="form-control" required>
                                        <option value="">Select Staff</option>
                                        {staffList.map((staff) => (
                                            <option key={staff.staffId} value={staff.staffId}>
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="amount" className="form-label">Amount</label>
                                    <input ref={amountRef} id="amount" type="number" className="form-control" placeholder="Enter salary amount" required />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="transactionId" className="form-label">Transaction ID</label>
                                    <input ref={transactionIdRef} id="transactionId" type="text" className="form-control" placeholder="Transaction ID (optional)" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="paymentDate" className="form-label">Payment Date</label>
                                    <input ref={paymentDateRef} id="paymentDate" type="date" className="form-control" required />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input ref={descriptionRef} id="description" type="text" className="form-control" placeholder="e.g., April 2025 salary" />
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={handlePaySalary}
                                        disabled={isAdding}
                                        style={{ backgroundColor: "#2980b9", padding: "12px 0" }}
                                    >
                                        {isAdding ? "Adding Salary..." : "Add Salary"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Salary Modal */}
            {/* {showViewModal && salaryDetails && (
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-primary">Salary Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container py-3">
                            <div className={styles.viewCard}>
                                <h4 className="mb-3 text-dark fw-semibold">
                                    Salary for {salaryDetails.name || "N/A"}
                                </h4>
                                <div className="row mb-2">
                                    <div className="col-sm-6"><strong>Amount:</strong> ₹{salaryDetails.amount?.toLocaleString() || "0"}</div>
                                    <div className="col-sm-6"><strong>Payment Date:</strong> {salaryDetails.paymentDate ? new Date(salaryDetails.paymentDate).toLocaleDateString() : "N/A"}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-6"><strong>Transaction ID:</strong> {salaryDetails.transactionId || "Not Provided"}</div>
                                    <div className="col-sm-6"><strong>Society:</strong> {salaryDetails.society?.societyName || "N/A"}</div>
                                </div>
                                <div className="mt-3">
                                    <p><strong>Description:</strong> {salaryDetails.description || "Not Provided"}</p>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )} */}
        </div>
    );
}
