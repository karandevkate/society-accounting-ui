"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import {
  PencilSquare,
  HourglassSplit,
  PeopleFill,
  CheckCircleFill,
  GeoAlt,
  House,
} from "react-bootstrap-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import styles from "@/app/management/[username]/dashboard/page.module.css";
export default function Dashboard() {
  const params = useParams();
  const username = params.username as string;

  const [showModal, setShowModal] = useState(false);
  const [society, setSociety] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    pendingMembers: 0,
    approvedMembers: 0,
    totalUsers: 0,
  });

  const [editSociety, setEditSociety] = useState({ ...society });

  useEffect(() => {
    fetchSocietyDetails();
  }, []);

  const fetchSocietyDetails = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/society/get-with-counts/${getSocietyId()}`
      );
      setSociety(res.data);
      setEditSociety(res.data);
    } catch (err) {
      console.error("Error fetching society details:", err);
    }
  };

  const handleEditClick = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditSociety({ ...society });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/society/update/${getSocietyId()}`,
        editSociety
      );
      setSociety({ ...editSociety });
      setShowModal(false);
    } catch (err) {
      console.error("Error updating society:", err);
    }
  };

  return (
    <div className="container mt-5 row g-4">
      <div className="col-md-5">
        <div className={`card ${styles.societyCard}`} >
          <div className={`${styles.societyHeader}`} >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <House size={22} /> Society Details
              </h5>
              <PencilSquare
                className={`${styles.editIcon}`}
                size={20}
                role="button"
                onClick={handleEditClick}
              />
            </div>
          </div>

          <div className={`${styles.societyBody}`}>
            <p><strong>Name:</strong> {society.name || "Loading..."}</p>
            <p><strong>Address:</strong> {society.address || "-"}</p>
            <p><strong>State:</strong> {society.state || "-"}</p>
            <p><strong>City:</strong> {society.city || "-"}</p>
          </div>
        </div>
      </div>




      <div className="col-md-7">
        <div className="row g-4">
          <div className="col-sm-6">
            <div
              className={`${styles.dashboardCard} card bg-warning text-dark shadow-lg rounded-4 p-4 text-center h-100`}
            >
              <HourglassSplit size={40} className="mb-3" />
              <h5 className="fw-bold">Pending Requests</h5>
              <h2 className="fw-bold">{society.pendingMembers || 0}</h2>
              <p>Members awaiting approval</p>
              <Link href={`/management/${username}/member-requests`}>
                <Button
                  variant="dark"
                  className="mt-2 px-4 rounded-pill fw-bold shadow-sm"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>

          {/* Approved Members */}
          <div className="col-sm-6">
            <div
              className={`${styles.dashboardCard} card bg-success text-light shadow-lg rounded-4 p-4 text-center h-100`}
            >
              <CheckCircleFill size={40} className="mb-3" />
              <h5 className="fw-bold">Approved Members</h5>
              <h2 className="fw-bold">{society.approvedMembers || 0}</h2>
              <p>Members approved</p>
              <Link href={`/management/${username}/member-list`}>
                <Button
                  variant="light"
                  className="mt-2 px-4 rounded-pill fw-bold shadow-sm"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>

          {/* Total Users */}
          <div className="col-sm-12">
            <div
              className={`${styles.dashboardCard} card bg-info text-dark shadow-lg rounded-4 p-4 text-center h-100`}
            >
              <PeopleFill size={40} className="mb-3" />
              <h5 className="fw-bold">Total Users</h5>
              <h2 className="fw-bold">{society.totalUsers || 0}</h2>
              <p>Total registered users</p>
              <Link href={`/management/${username}/user-list`}>
                <Button
                  variant="dark"
                  className="mt-2 px-4 rounded-pill fw-bold shadow-sm"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Edit Society */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Society Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Society Name</Form.Label>
              <Form.Control
                type="text"
                value={editSociety.name}
                onChange={(e) =>
                  setEditSociety({ ...editSociety, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Detail Address</Form.Label>
              <Form.Control
                type="text"
                value={editSociety.address}
                onChange={(e) =>
                  setEditSociety({ ...editSociety, address: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={editSociety.state}
                onChange={(e) =>
                  setEditSociety({ ...editSociety, state: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={editSociety.city}
                onChange={(e) =>
                  setEditSociety({ ...editSociety, city: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



    </div >
  );
}
