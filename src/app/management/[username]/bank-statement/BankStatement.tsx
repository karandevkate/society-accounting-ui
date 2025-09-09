"use client";

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "@/config/apiConfig";

export default function BankStatement() {
  const [uploadedBy, setUploadedBy] = useState("");
  const [bankName, setBankName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !uploadedBy || !bankName) {
      toast.error("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedBy", uploadedBy);
    formData.append("bankName", bankName);

    try {
      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success(response.data || "Bank statement uploaded successfully.");
      setFile(null);
    } catch (error: any) {
      toast.error(error?.response?.data || "Upload failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Bank Statement</h2>

      <div className="mb-3">
        <label className="form-label">Uploaded By</label>
        <input
          type="text"
          className="form-control"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select Bank</label>
        <select
          className="form-select"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        >
          <option value="" selected disabled>-- Select Bank --</option>
          <option value="SBI_CURRENT">State Bank of India</option>
          <option value="HDFC">HDFC</option>
          <option value="Kotak">Kotak</option>
          <option value="PNB">PNB</option>
          <option value="BOM">Bank Of Maharashtra</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload CSV</label>
        <input
          type="file"
          className="form-control"
          accept=".csv"
          onChange={handleFileChange}
        />
        {file && <small className="text-success">Selected: {file.name}</small>}
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Upload Statement
      </button>

      <ToastContainer />
    </div>
  );
}
