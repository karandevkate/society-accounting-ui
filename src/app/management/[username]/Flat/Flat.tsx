"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import * as XLSX from "xlsx"; // Import xlsx library
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import styles from "@/app/management/[username]/staff/page.module.css";
import tableStyles from "@/app/css/table.module.css";

export default function Flat() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [flats, setFlats] = useState<any[]>([]);
    const [isSelfOccupied, setIsSelfOccupied] = useState(false);
    const [activeTab, setActiveTab] = useState<"add" | "upload">("add"); // Toggle between add and upload
    const wingRef = useRef<HTMLInputElement>(null);
    const flatRef = useRef<HTMLInputElement>(null);
    const flatTypeRef = useRef<HTMLInputElement>(null);
    const selfOccupiedRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const societyIdRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFlats();
    }, []);

    const fetchFlats = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/flats/society/${getSocietyId()}`);
            setFlats(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load flats.");
        }
    };

    const handleAddFlat = async () => {
        if (!wingRef.current?.value || !flatRef.current?.value || !flatTypeRef.current?.value) {
            toast.error("Please fill all fields.");
            return;
        }

        const data = {
            societyId: getSocietyId(),
            wing: wingRef.current?.value,
            flat: flatRef.current?.value,
            flatType: flatTypeRef.current?.value,
            selfOccupied: isSelfOccupied,
        };

        try {
            await axios.post(`${BASE_URL}/flats`, data);
            toast.success("Flat added successfully!");
            setShowAddModal(false);
            fetchFlats();

            if (wingRef.current) wingRef.current.value = "";
            if (flatRef.current) flatRef.current.value = "";
            if (flatTypeRef.current) flatTypeRef.current.value = "";
            if (selfOccupiedRef.current) selfOccupiedRef.current.checked = false;
        } catch (error) {
            console.error(error);
            toast.error("Failed to add flat.");
        }
    };

    const handleFileUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        // const societyId = localStorage.getItem("societyId");

        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }
        if (!getSocietyId()) {
            toast.error("Society ID not found in local storage.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("societyId", getSocietyId());

        try {
            await axios.post(`${BASE_URL}/flats/bulk`, formData);
            toast.success("Flats uploaded successfully!");
            setShowAddModal(false);
            fetchFlats();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to upload flats: " + (error.response?.data || error.message));
        }
    };


    const downloadTemplate = () => {
        const templateData = [
            {
                Wing: "A",
                Flat: "101",
                "Flat Type": "2 BHK",
                "Owner Status": "Yes",
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Flat Template");
        XLSX.writeFile(workbook, "flat_template.xlsx");
    };

    return (
        <div className={styles.container} style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className={tableStyles.headerSection} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#333", fontSize: "1.5em", fontWeight: "600" }}>Flat Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                    style={{ backgroundColor: "#007bff", borderColor: "#007bff", padding: "10px 20px", borderRadius: "5px", fontSize: "1em" }}
                >
                    Add Flat
                </button>
            </div>
            <div className="d-flex align-items-center" style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#fff", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <p style={{ margin: "0 15px 0 0", fontSize: "0.95em", color: "#666", fontWeight: "500" }}>
                    To add multiple flats, you can upload an Excel file.
                </p>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        downloadTemplate();
                    }}
                    style={{
                        fontSize: "0.95em",
                        color: "#007bff",
                        textDecoration: "underline",
                        cursor: "pointer",
                        transition: "color 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#0056b3")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#007bff")}
                >
                    click to download excel format
                </a>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <Card className={tableStyles.card} >
                        <Card.Body>
                            <div className={tableStyles.tableWrapper}>
                                <table className={tableStyles.customTable} >
                                    <thead className={tableStyles.tableHead}>
                                        <tr>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Sr No</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Wing</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Flat</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Flat Type</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Occupancy Status</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flats.length > 0 ? (
                                            flats.map((flat, index) => (
                                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{index + 1}</td>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{flat.wing}</td>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{flat.flat}</td>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{flat.flatType}</td>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{flat.selfOccupied ? "Owner" : "Tenant"}</td>
                                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                                        <button className="btn btn-info btn-sm" style={{ padding: "5px 10px", borderRadius: "5px", color: "#fff", backgroundColor: '#007bff' }}>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                                                    No flats available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>


            {showAddModal && (
                <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
                    <div className="modal-dialog" style={{ marginTop: "10vh" }}>
                        <div className="modal-content" style={{ borderRadius: "8px", overflow: "hidden" }}>
                            <div className="modal-header" style={{ backgroundColor: "#007bff", color: "#fff", borderBottom: "none" }}>
                                <h5 className="modal-title" style={{ fontSize: "1.2em", fontWeight: "600" }}>Add Flat</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    style={{ filter: "invert(1)" }}
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setActiveTab("add");
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                        if (societyIdRef.current) societyIdRef.current.value = "";
                                    }}
                                ></button>
                            </div>
                            <div className={styles.modalContent} style={{ padding: "20px" }}>

                                <div className="d-flex mb-4" style={{ borderBottom: "2px solid #007bff" }}>
                                    <button
                                        className={`btn ${activeTab === "add" ? "btn-primary" : "btn-outline-primary"}`}
                                        style={{
                                            flex: 1,
                                            marginRight: "5px",
                                            borderRadius: "5px 5px 0 0",
                                            backgroundColor: activeTab === "add" ? "#007bff" : "#fff",
                                            color: activeTab === "add" ? "#fff" : "#007bff",
                                            border: "none",
                                            padding: "10px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setActiveTab("add")}
                                    >
                                        Add Flat
                                    </button>
                                    <button
                                        className={`btn ${activeTab === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                                        style={{
                                            flex: 1,
                                            borderRadius: "5px 5px 0 0",
                                            backgroundColor: activeTab === "upload" ? "#007bff" : "#fff",
                                            color: activeTab === "upload" ? "#fff" : "#007bff",
                                            border: "none",
                                            padding: "10px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setActiveTab("upload")}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {activeTab === "add" && (
                                    <>
                                        <div className="form-group mb-3">
                                            <label className="form-label" style={{ fontWeight: "500", color: "#333" }}>Wing</label>
                                            <input
                                                ref={wingRef}
                                                type="text"
                                                className="form-control"
                                                placeholder="Eg: A"
                                                required
                                                style={{ borderRadius: "5px", padding: "8px" }}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label" style={{ fontWeight: "500", color: "#333" }}>Flat</label>
                                            <input
                                                ref={flatRef}
                                                type="text"
                                                className="form-control"
                                                placeholder="Eg: 101"
                                                required
                                                style={{ borderRadius: "5px", padding: "8px" }}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label" style={{ fontWeight: "500", color: "#333" }}>Flat Type</label>
                                            <input
                                                ref={flatTypeRef}
                                                type="text"
                                                className="form-control"
                                                placeholder="Eg: 1 BHK"
                                                required
                                                style={{ borderRadius: "5px", padding: "8px" }}
                                            />
                                        </div>
                                        <div className="form-group mb-3 d-flex align-items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="selfOccupied"
                                                checked={isSelfOccupied}
                                                onChange={(e) => setIsSelfOccupied(e.target.checked)}
                                                style={{ marginTop: "0" }}
                                            />
                                            <label
                                                className="form-check-label mb-0"
                                                htmlFor="selfOccupied"
                                                style={{ fontWeight: "500", color: "#333" }}
                                            >
                                                Owner Occupied
                                            </label>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={handleAddFlat}
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    borderColor: "#007bff",
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    fontSize: "1em",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Add Flat
                                            </button>
                                        </div>
                                    </>
                                )}


                                {activeTab === "upload" && (
                                    <div className="form-group mb-4">
                                        <label className="form-label" style={{ fontWeight: "500", color: "#333" }}>Upload Excel File</label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx, .xls"
                                            className="form-control"
                                            style={{ borderRadius: "5px", padding: "8px" }}
                                        />
                                        <div className="text-center mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={handleFileUpload}
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    borderColor: "#007bff",
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    fontSize: "1em",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}