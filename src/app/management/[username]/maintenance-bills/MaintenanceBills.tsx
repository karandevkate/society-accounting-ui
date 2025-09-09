"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";

interface Bill {
  collectionId: string;
  matrixChargesId: string;
  flatNumber: string;
  paidAmount: number;
  paidDate: string;
  paymentMode: string;
  transactionRefNumber: string;
  verified: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  imageUrl?: string; // changed from Uint8Array
}

export default function MaintenanceBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [verifiedBy, setVerifiedBy] = useState("");

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    flatNumber: "",
    amount: 0,
    chargesType: "",
    description: ""
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bills/society/${getSocietyId()}`);
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills", error);
    }
  };

  const handleVerify = (bill: Bill) => {
    setSelectedBill(bill);
    setShowVerifyModal(true);
  };

  const confirmVerify = async () => {
    if (!selectedBill) return;
    try {
      await axios.post(`${BASE_URL}/api/bills/${selectedBill.collectionId}/verify`, null, {
        params: { verifiedBy },
      });
      toast.success("Bill verified successfully");
      setShowVerifyModal(false);
      setVerifiedBy("");
      setSelectedBill(null);
      fetchBills();
    } catch (error) {
      toast.error("Error verifying bill");
    }
  };

  const handleManualSubmit = async () => {
    if (!manualForm.flatNumber || !manualForm.amount || !manualForm.chargesType) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/societies/${getSocietyId}/bills/manual`, manualForm);
      toast.success("Manual bill added successfully");
      setShowManualModal(false);
      setManualForm({ flatNumber: "", amount: 0, chargesType: "", description: "" });
      fetchBills();
    } catch (error) {
      toast.error("Error adding manual bill");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Maintenance Bills</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowManualModal(true)}>
        Add Manual Bill
      </Button>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Flat Number</th>
            <th>Paid Amount</th>
            <th>Paid Date</th>
            <th>Payment Mode</th>
            <th>Transaction Ref</th>
            <th>Verification Date</th>
            <th>Verified By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.collectionId}>
              <td>{bill.flatNumber}</td>
              <td>{bill.paidAmount}</td>
              <td>{new Date(bill.paidDate).toLocaleDateString()}</td>
              <td>{bill.paymentMode}</td>
              <td>{bill.transactionRefNumber}</td>
              <td>{bill.verificationDate}</td>
              <td>{bill.verifiedBy}</td>
              <td className={bill.verified ? "text-success fw-bold" : "text-warning fw-bold"}>
                {bill.verified ? "Verified" : "Not Verified"}
              </td>
              <td>
                {!bill.verified && (
                  <Button variant="outline-success" size="sm" onClick={() => handleVerify(bill)}>
                    Verify
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Verify Modal */}
      <Modal show={showVerifyModal} onHide={() => { setShowVerifyModal(false); setSelectedBill(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBill ? (
            <>
              <p><strong>Flat Number:</strong> {selectedBill.flatNumber}</p>
              <p><strong>Paid Amount:</strong> ₹{selectedBill.paidAmount}</p>
              <p><strong>Paid Date:</strong> {new Date(selectedBill.paidDate).toLocaleDateString()}</p>
              <p><strong>Payment Mode:</strong> {selectedBill.paymentMode}</p>
              <p><strong>Transaction Ref No. / Cheque No. :</strong> <h2>{selectedBill.transactionRefNumber}</h2></p>
              <div><strong>Payment Proof:</strong>
                {selectedBill.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={`data:image/jpeg;base64,${selectedBill.imageUrl}`}
                      alt="Payment Proof"
                      style={{ maxWidth: "100%", maxHeight: "300px", border: "1px solid #ccc" }}
                    />
                  </div>
                )}
              </div>
              <Form.Group>
                <Form.Label>Verified By</Form.Label>
                <Form.Control
                  type="text"
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  placeholder="Enter your name"
                />
              </Form.Group>
            </>
          ) : (
            <p>Loading bill details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowVerifyModal(false); setSelectedBill(null); }}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmVerify}>
            Confirm Verify
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manual Add Bill Modal */}
      <Modal show={showManualModal} onHide={() => {
        setShowManualModal(false);
        setManualForm({ flatNumber: "", amount: 0, chargesType: "", description: "" });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Manual Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Flat Number</Form.Label>
              <Form.Control
                value={manualForm.flatNumber}
                onChange={(e) => setManualForm({ ...manualForm, flatNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={manualForm.amount}
                onChange={(e) => setManualForm({ ...manualForm, amount: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Charge Type</Form.Label>
              <Form.Select
                value={manualForm.chargesType}
                onChange={(e) => setManualForm({ ...manualForm, chargesType: e.target.value })}
              >
                <option value="" disabled>Select</option>
                <option value="FINE">Fine</option>
                <option value="NO_PARKING_FINE">No Parking Fine</option>
                <option value="WATER_WASTE">Water Waste</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={manualForm.description}
                onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowManualModal(false);
            setManualForm({ flatNumber: "", amount: 0, chargesType: "", description: "" });
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleManualSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
