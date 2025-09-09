"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "@/app/management/[username]/society-journal/page.module.css";
import tableStyles from "@/app/css/table.module.css";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";

export default function SocietyJournal() {
    const [loading, setLoading] = useState(false);
    const [journalList, setJournalList] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // filters
    const [flatNumber, setFlatNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchJournals(); // load all on page load
    }, []);

    const fetchJournals = async (applyFilters = false) => {
        setLoading(true);
        try {
            const params: any = { societyId: getSocietyId() };

            if (applyFilters) {
                if (flatNumber) params.flatNumber = flatNumber;
                if (startDate && endDate) {
                    params.startDate = startDate;
                    params.endDate = endDate;
                }
            }

            const response = await axios.get(`${BASE_URL}/api/journal`, { params });

            setJournalList(response.data);

            if (response.data.length === 0) {
                toast.info("No journal records found.");
            }
        } catch (error: any) {
            setJournalList([]); // clear table when error
            const msg = error.response?.data?.error || "Error fetching journal records.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={`${tableStyles.headerSection} d-flex justify-content-between align-items-center`}>
                <h2>Society Journal</h2>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="bi bi-funnel"></i> Filters
                </button>
            </div>

            {/* Filter Section (Dropdown Style) */}
            {showFilters && (
                <Card className="mb-3 shadow-sm">
                    <Card.Body>
                        <div className="row">
                            <div className="col-md-3">
                                <label className="form-label">Flat Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={flatNumber}
                                    onChange={(e) => setFlatNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() => fetchJournals(true)}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Apply Filters"}
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Journal Table */}
            <Card className={`${tableStyles.card} shadow-sm`}>
                <Card.Body>
                    <div
                        style={{
                            maxHeight: "500px",
                            overflowY: "auto",
                            overflowX: "auto",
                        }}
                    >
                        <table
                            className={`table table-hover align-middle ${tableStyles.customTable}`}
                        >
                            <thead className={`${tableStyles.tableHead} sticky-top`}>
                                <tr>
                                    <th>#</th>
                                    <th>Flat</th>
                                    <th>Value Date</th>
                                    <th>Transaction Date</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Narration</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {journalList.length > 0 ? (
                                    journalList.map((journal, index) => (
                                        <tr key={journal.journalId || index}>
                                            <td>{index + 1}</td>
                                            <td>{journal.flatNumber}</td>
                                            <td>
                                                {journal.valueDate
                                                    ? new Date(journal.valueDate).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td>
                                                {journal.transactionDate
                                                    ? new Date(journal.transactionDate).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td className="text-danger fw-bold">{journal.debitAmount}</td>
                                            <td className="text-success fw-bold">{journal.creditAmount}</td>
                                            <td>{journal.narration}</td>
                                            <td>{journal.comments}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            No data to display
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
