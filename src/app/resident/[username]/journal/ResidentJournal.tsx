"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "@/app/management/[username]/society-journal/page.module.css";
import tableStyles from "@/app/css/table.module.css";
import { BASE_URL, getFlatNumber, getSocietyId } from "@/config/apiConfig";

export default function ResidentJournal() {
    const [loading, setLoading] = useState(false);
    const [journalList, setJournalList] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        const flatNumber = getFlatNumber();


        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/journal/flat-wise-journal`, {
                params: {
                    societyId: getSocietyId(),
                    flatNumber: getFlatNumber(),
                },
            });
            setJournalList(response.data);

            if (response.data.length === 0) {
                toast.info("No journal records found.");
            }
        } catch (error: any) {
            setJournalList([]);
            const msg = error.response?.data?.error || "Error fetching journal records.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={`${styles.headerSection} d-flex justify-content-between align-items-center`}>
                <h2>My Account Book</h2>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="bi bi-funnel"></i> Filters
                </button>
            </div>

            <Card className={`${styles.card} shadow-sm`}>
                <Card.Body>
                    <div className={styles.tableWrapper}>
                        <table
                            className={`table  table-hover align-middle ${tableStyles.customTable}`}
                        >
                            <thead className={`${tableStyles.tableHead} sticky-top`}>
                                <tr>
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
                                            <td style={{ width: "100px", textAlign: "center" }}>{journal.flatNumber}</td>
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
        </div >
    );
}
