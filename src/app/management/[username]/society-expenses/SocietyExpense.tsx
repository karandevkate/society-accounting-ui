"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/management/[username]/society-expenses/page.module.css";
import tableStyles from "@/app/css/table.module.css";
import { Card } from "react-bootstrap";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function SocietyExpense() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [societyExpenseList, setSocietyExpenseList] = useState<any>([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState("");
    const [salaryDetailsMap, setSalaryDetailsMap] = useState<any>([]);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const expenseDateRef = useRef<HTMLInputElement>(null);
    const totalAmountRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const otherExpenseTypeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSocietyExpenseList();
    }, []);

    const fetchSocietyExpenseList = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/society/${getSocietyId()}/societyExpense`);
            setSocietyExpenseList(response.data);
        } catch (error) {
            console.error("Failed to fetch expense list:", error);
            toast.error("Failed to load expense records.");
        }
    };

    const addSocietyExpense = async () => {
        setLoading(true);
        const expenseType = selectedExpenseType === "Other" ? otherExpenseTypeRef.current?.value : selectedExpenseType;

        if (!expenseType || !expenseDateRef.current?.value || !totalAmountRef.current?.value) {
            toast.error("Please fill all required fields.");
            setLoading(false);
            return;
        }

        const formData = {
            expenseType,
            expenseDate: expenseDateRef.current.value,
            totalAmount: Number(totalAmountRef.current.value),
            description: descriptionRef.current?.value || "",
            societyId: getSocietyId(),
        };

        try {
            const response = await axios.post(`${BASE_URL}/society/societyExpense`, formData);
            toast.success(response.data);
            setShowAddModal(false);
            fetchSocietyExpenseList();
            setSelectedExpenseType("");
            if (expenseDateRef.current) expenseDateRef.current.value = "";
            if (totalAmountRef.current) totalAmountRef.current.value = "";
            if (descriptionRef.current) descriptionRef.current.value = "";
            if (otherExpenseTypeRef.current) otherExpenseTypeRef.current.value = "";
        } catch (error) {
            toast.error("Expense add failed.");
        } finally {
            setLoading(false);
        }
    };

    const getSalaryDetails = async (expenseDate: Date, rowIndex: number) => {
        if (salaryDetailsMap[rowIndex]) {
            setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/staff/${expenseDate}/staffSalarybyDate`);
            setSalaryDetailsMap((prev: any) => ({
                ...prev,
                [rowIndex]: response.data,
            }));
            setExpandedRow(rowIndex);
        } catch (error) {
            const msg = "Failed to load salary details.";
            toast.error(msg);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />

            <div className={tableStyles.headerSection}>
                <h2>Society Expense</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`btn btn-primary ${styles.addButton}`}
                >
                    Add New Expense
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
                                            <th scope="col">SrNo</th>
                                            <th scope="col">Expense Type</th>
                                            <th scope="col">Expense Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {societyExpenseList.map((expense: any, index: number) => (
                                            <React.Fragment key={index}>
                                                <tr className={tableStyles.tableRow}>
                                                    <td>{index + 1}</td>
                                                    <td>{expense.expenseType || "N/A"}</td>
                                                    <td>{expense.expenseDate || "N/A"}</td>
                                                    <td>₹ {expense.totalAmount?.toLocaleString() || "N/A"}</td>
                                                    <td>{expense.description || "-"}</td>
                                                    <td>
                                                        {expense.expenseType === "Salaries" ? (
                                                            <button
                                                                className={`btn btn-sm ${styles.viewButton}`}
                                                                onClick={() => getSalaryDetails(expense.expenseDate, index)}
                                                                aria-controls={`salary-details-${index}`}
                                                            >
                                                                {expandedRow === index ? "Hide Details" : "View Salary Details"}
                                                            </button>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                </tr>

                                                {expandedRow === index && salaryDetailsMap[index] && (
                                                    <tr
                                                        className={`${styles.salaryDetailsRow} ${expandedRow === index ? styles.expanded : ""}`}
                                                        id={`salary-details-${index}`}
                                                    >
                                                        <td colSpan={6}>
                                                            <div className={styles.salaryDetailsContent}>
                                                                {Array.isArray(salaryDetailsMap[index]) && salaryDetailsMap[index].length > 0 ? (
                                                                    <table className={styles.innerTable}>
                                                                        <thead className={styles.innerTableHeader}>
                                                                            <tr>
                                                                                <th>Name</th>
                                                                                <th>Payment Date</th>
                                                                                <th>Amount</th>
                                                                                <th>Description</th>
                                                                                <th>Transaction ID</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {salaryDetailsMap[index].map((detail, i) => (
                                                                                <tr key={`salary-detail-${index}-${i}`}>
                                                                                    <td>{detail.name}</td>
                                                                                    <td>{detail.paymentDate}</td>
                                                                                    <td>₹ {detail.amount.toLocaleString()}</td>
                                                                                    <td>{detail.description}</td>
                                                                                    <td>{detail.transactionId}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <p className={tableStyles.noData}>No salary details found.</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {
                showAddModal && (
                    <div className={`modal show ${styles.modal}`} style={{ display: "block" }} tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Society Expense</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAddModal(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className={styles.modalContent}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="expenseType" className="form-label">
                                            Expense Type
                                        </label>
                                        <select
                                            id="expenseType"
                                            className="form-control"
                                            value={selectedExpenseType}
                                            onChange={(e) => setSelectedExpenseType(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Expense Type
                                            </option>
                                            <option value="Salaries">Salaries</option>
                                            <option value="Light Bill">Light Bill</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Security">Security</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {selectedExpenseType === "Other" && (
                                            <input
                                                type="text"
                                                className="form-control mt-2"
                                                placeholder="Enter custom expense type"
                                                ref={otherExpenseTypeRef}
                                                required
                                            />
                                        )}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="expenseDate" className="form-label">
                                            Expense Date
                                        </label>
                                        <input
                                            id="expenseDate"
                                            type="date"
                                            className="form-control"
                                            ref={expenseDateRef}
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="totalAmount" className="form-label">
                                            Total Amount
                                        </label>
                                        <input
                                            id="totalAmount"
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter total amount"
                                            ref={totalAmountRef}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            placeholder="Enter description"
                                            ref={descriptionRef}
                                            maxLength={255}
                                        />
                                    </div>

                                    <div className="text-center mt-4">
                                        <button
                                            onClick={addSocietyExpense}
                                            className={`btn btn-primary ${styles.modalButton}`}
                                            disabled={loading}
                                        >
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className={`btn btn-secondary ms-2 ${styles.modalButton}`}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
