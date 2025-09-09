"use client"
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { PencilSquare } from "react-bootstrap-icons";
import { Card, Modal, Button } from "react-bootstrap";
import { BASE_URL, getSocietyId } from "@/config/apiConfig";
import styles from "@/app/management/[username]/staff/page.module.css";
import tableStyles from "@/app/css/table.module.css";

export default function Staff() {
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [staffDetails, setStaffDetails] = useState<any>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const govIdNumberRef = useRef<HTMLInputElement>(null);
    const govIdPhotoRef = useRef<HTMLInputElement>(null);
    const staffPhotoRef = useRef<HTMLInputElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const permanentAddressRef = useRef<HTMLInputElement>(null);
    const currentAddressRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLInputElement>(null);
    const salaryRef = useRef<HTMLInputElement>(null);
    const joiningDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/staff/${getSocietyId()}`);
            const normalized = response.data.map((staff: any) => ({
                ...staff,
                staffStatus: staff.staffStatus ?? staff.status ?? false,
            }));
            setStaffList(normalized);
            console.log(normalized);
            if (normalized.length === 0) {
                toast.error('No staff record');
            }
        } catch (error: any) {
            console.error('Error fetching staff data:', error);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', nameRef.current?.value || '');
        formData.append('govIdNumber', govIdNumberRef.current?.value || '');
        formData.append('govIdPhoto', govIdPhotoRef.current?.files?.[0] || '');
        formData.append('staffPhoto', staffPhotoRef.current?.files?.[0] || '');
        formData.append('contact', contactRef.current?.value || '');
        formData.append('email', emailRef.current?.value || '');
        formData.append('permanentAddress', permanentAddressRef.current?.value || '');
        formData.append('currentAddress', currentAddressRef.current?.value || '');
        formData.append('role', roleRef.current?.value || '');
        formData.append('salary', salaryRef.current?.value || '');
        formData.append('joiningDate', joiningDateRef.current?.value || '');
        formData.append('societyId', getSocietyId() ?? '');

        try {
            const response = await axios.post(`${BASE_URL}/staff`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStaffList((prevStaffList) => [...prevStaffList, response.data]);
            toast.success("Staff added successfully!");
            setShowAddModal(false);
            fetchStaff();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error adding staff';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (staffId: string) => {
        setLoading(true);
        try {
            const response = await axios.put(`${BASE_URL}/staff/status/${staffId}`);
            const updatedStatus = response.data;
            if (updatedStatus === true || updatedStatus === "true") {
                toast.success("Staff status changed to Active successfully!");
            } else {
                toast.error("Staff status changed to Inactive successfully!");
            }
            setStaffList(prevList =>
                prevList.map(staff =>
                    staff.staffId === staffId ? { ...staff, staffStatus: updatedStatus } : staff
                )
            );
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Error changing staff status';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const viewStaff = async (staffId: number) => {
        setShowViewModal(true);
        try {
            const response = await axios.get(`${BASE_URL}/staff/staffofsociety/${staffId}`);
            setStaffDetails(response.data);
        } catch (err: any) {
            toast.error("Error fetching staff details: " + err.message);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={tableStyles.headerSection}>
                <h2>Staff</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#0078d7', borderColor: '#2980b9', padding: '12px' }}
                >
                    Add Staff
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
                                            <th>Staff Profile</th>
                                            <th>Staff Name</th>
                                            <th>Contact</th>
                                            <th>Role</th>
                                            <th>Salary</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staffList.map((staff, index) => (
                                            <tr key={staff.staffId}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img
                                                        src={`data:image/jpeg;base64,${staff.staffPhoto}`}
                                                        alt={staff.name}
                                                        style={{ height: "80px", width: "80px", borderRadius: "50%" }}
                                                        className={styles.profileImage}
                                                    />
                                                </td>
                                                <td>{staff.name}</td>
                                                <td>{staff.contact}</td>
                                                <td>{staff.role}</td>
                                                <td>{staff.salary?.toLocaleString() || "N/A"}</td>
                                                <td className={styles.statusCell}>
                                                    <label className={styles.switch}>
                                                        <input
                                                            type="checkbox"
                                                            checked={Boolean(staff.staffStatus)}
                                                            onChange={() => handleToggleStatus(staff.staffId)}
                                                        />
                                                    </label>
                                                    <span className={`${styles.statusText} mx-2`}>
                                                        {staff.staffStatus ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <PencilSquare
                                                        className={`${styles.actionIcon} text-primary`}
                                                        size={24}
                                                        role="button"
                                                        onClick={() => viewStaff(staff.staffId)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Modal for Add Staff */}
            {showAddModal && (
                <div className="modal show modal-lg" style={{ display: 'block' }} tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div
                                className="modal-header"
                                style={{ backgroundColor: "#007bff", color: "#fff", borderBottom: "none" }}
                            >
                                <h5 className="modal-title">Add Staff</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body px-4 py-3">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input ref={nameRef} type="text" className="form-control" placeholder="Enter full name" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Contact</label>
                                        <input ref={contactRef} type="text" className="form-control" placeholder="Enter contact number" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input ref={emailRef} type="email" className="form-control" placeholder="Enter email (optional)" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Role</label>
                                        <input ref={roleRef} type="text" className="form-control" placeholder="Enter role" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Salary</label>
                                        <input ref={salaryRef} type="number" className="form-control" placeholder="Enter salary" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Gov ID Number</label>
                                        <input ref={govIdNumberRef} type="text" className="form-control" placeholder="Enter government ID number" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Gov ID Photo</label>
                                        <input ref={govIdPhotoRef} type="file" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Staff Photo</label>
                                        <input ref={staffPhotoRef} type="file" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Permanent Address</label>
                                        <input ref={permanentAddressRef} type="text" className="form-control" placeholder="Enter permanent address" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Joining Date</label>
                                        <input ref={joiningDateRef} type="date" className="form-control" required
                                            defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Current Address</label>
                                        <input ref={currentAddressRef} type="text" className="form-control" placeholder="Enter current address" />
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={onSubmit}
                                        disabled={loading}
                                        style={{ backgroundColor: "#007bff", borderColor: "#007bff", padding: "12px 0" }}
                                    >
                                        {loading ? "Adding Staff..." : "Add Staff"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for View Staff */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg" className="fade">
                <Modal.Header style={{ background: "linear-gradient(90deg, #007bff, #0056b3)", color: "#fff", borderBottom: "none", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                    <Modal.Title className="ms-3">Staff Profile</Modal.Title>
                    <button
                        style={{ color: "#fff" }}
                        type="button"
                        className="btn-close"
                        onClick={() => setShowViewModal(false)}
                    ></button>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="card p-4 shadow-lg bg-light" style={{ borderRadius: "15px" }}>
                        {/* Top section with name and circular profile */}
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <img
                                src={`data:image/jpeg;base64,${staffDetails?.staffPhoto}`}
                                alt="Staff"
                                className="rounded-circle shadow"
                                style={{ width: "100px", height: "100px", objectFit: "cover", border: "3px solid #007bff" }}
                            />
                            <div>
                                <h3 className="text-primary fw-bold mb-1">{staffDetails?.name || "N/A"}</h3>
                                <span className={`badge ${staffDetails?.status ? "bg-success" : "bg-danger"} px-3 py-2`}>
                                    {staffDetails?.status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="row g-3">
                            <div className="col-md-6">
                                <strong className="text-secondary">Role:</strong>
                                <div>{staffDetails?.role || "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Gov ID No:</strong>
                                <div>{staffDetails?.govIdNumber || "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Contact:</strong>
                                <div>{staffDetails?.contact || "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Email:</strong>
                                <div>{staffDetails?.email || "Not Provided"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Salary:</strong>
                                <div>₹{staffDetails?.salary?.toLocaleString() || "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Joining Date:</strong>
                                <div>{staffDetails?.joiningDate ? new Date(staffDetails.joiningDate).toLocaleDateString() : "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Society:</strong>
                                <div>{staffDetails?.society?.societyName || "N/A"}</div>
                            </div>
                            <div className="col-md-6">
                                <strong className="text-secondary">Permanent Address:</strong>
                                <div>{staffDetails?.permanentAddress || "Not Provided"}</div>
                            </div>
                            <div className="col-md-12">
                                <strong className="text-secondary">Current Address:</strong>
                                <div>{staffDetails?.currentAddress || "Not Provided"}</div>
                            </div>
                        </div>

                        {/* Gov ID Photo */}
                        <div className="mt-4">
                            <h6 className="text-muted mb-2">Gov ID Photo</h6>
                            <div className="text-center">
                                <img
                                    src={`data:image/jpeg;base64,${staffDetails?.govIdPhoto}`}
                                    alt="Gov ID"
                                    className="img-fluid shadow"
                                    style={{ maxHeight: "300px", objectFit: "cover", borderRadius: "10px" }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
}