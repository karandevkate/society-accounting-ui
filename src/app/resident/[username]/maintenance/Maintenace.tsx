"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, getFlatNumber, getSocietyId } from "@/config/apiConfig";
import styles from "@/app/management/[username]/staff/page.module.css";
import tableStyles from "@/app/css/table.module.css";

export default function BillManagement() {
    const [bills, setBills] = useState<any[]>([]);
    const [flatNumber, setFlatNumber] = useState<string>("");
    const [showAddModal, setShowAddModal] = useState(false);

    const flatNumberRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const paidDateRef = useRef<HTMLInputElement>(null);
    const paymentModeRef = useRef<HTMLSelectElement>(null);
    const txnRefRef = useRef<HTMLInputElement>(null);
    const imageFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const flatNumber = getFlatNumber();
        if (flatNumber) {
            fetchBills(flatNumber);
            setFlatNumber(flatNumber);
        }
    }, []);

    const fetchBills = async (flatNumber: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/bills/flat/${flatNumber}`);
            setBills(response.data);
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    const handleAddBill = async () => {
        const flatNumber = flatNumberRef.current?.value;
        const paidAmount = parseFloat(amountRef.current?.value || "0");
        const paidDateRaw = paidDateRef.current?.value;
        const paymentMode = paymentModeRef.current?.value;
        const transactionRefNumber = txnRefRef.current?.value;
        const image = imageFileRef.current?.files?.[0];

        if (!flatNumber || !paidAmount || !paidDateRaw || !paymentMode || !image) {
            toast.error("Please fill all fields and select a file.");
            return;
        }
        const paidDate = new Date(paidDateRaw).toISOString();
        const dto = {
            matrixChargesId: "056c078d-fbd5-4e4b-bbb1-32036a15df20",
            flatNumber,
            paidAmount,
            paidDate,
            paymentMode,
            transactionRefNumber,
            societyId: getSocietyId()
        };

        const formData = new FormData();
        formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
        formData.append("image", image);

        try {
            await axios.post(`${BASE_URL}/api/bills`, formData);
            toast.success("Bill added successfully!");
            setShowAddModal(false);
            fetchBills(flatNumber);
        } catch (error: any) {
            console.error("Error adding bill:", error);
            toast.error("Failed to add bill.");
        }
    };

    return (
        <div className={styles.container} style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className={tableStyles.headerSection} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#333", fontSize: "1.5em", fontWeight: "600" }}>Bill Collection</h2>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Add Paid Bill Details
                </button>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <Card className={tableStyles.card} style={{ borderRadius: "5px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <Card.Body>
                            <div className={tableStyles.tableWrapper}>
                                <table className={tableStyles.customTable} style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead className={tableStyles.tableHead} style={{ backgroundColor: "#007bff", color: "#fff" }}>
                                        <tr>
                                            <th>Sr No</th>
                                            <th>Flat No</th>
                                            <th>Amount</th>
                                            <th>Payment Date</th>
                                            <th>Mode</th>
                                            <th>Txn Ref</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.length > 0 ? (
                                            bills.map((bill, index) => (
                                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                                                    <td>{index + 1}</td>
                                                    <td>{bill.flatNumber}</td>
                                                    <td>₹{bill.paidAmount}</td>
                                                    <td>{new Date(bill.paidDate).toLocaleDateString()}</td>
                                                    <td>{bill.paymentMode}</td>
                                                    <td>{bill.transactionRefNumber || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: "center", color: "#666" }}>No bill records available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" style={{ marginTop: "10vh" }}>
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Add Paid Bill Details</h5>
                                <button type="button" className="btn-close" style={{ filter: "invert(1)" }} onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Flat Number</label>
                                    <input type="text" ref={flatNumberRef} value={flatNumber} className="form-control" placeholder="Eg: A-101" disabled />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Paid Amount</label>
                                    <input type="number" ref={amountRef} className="form-control" placeholder="Eg: 1500" />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Paid Date</label>
                                    <input type="date" ref={paidDateRef} className="form-control" />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Payment Mode</label>
                                    <select ref={paymentModeRef} className="form-select">
                                        <option value="" selected disabled>Select Mode</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="NEFT">NEFT</option>
                                        <option value="IMPS">IMPS</option>
                                        <option value="RTGS">RTGS</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="Credit Card">Credit Card</option>
                                    </select>

                                </div>
                                <div className="form-group mb-3">
                                    <label>Transaction Ref Number</label>
                                    <input type="text" ref={txnRefRef} className="form-control" placeholder="Eg: TXN123456789" />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Upload File</label>
                                    <input type="file" ref={imageFileRef} className="form-control" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddBill}>Add Bill</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
