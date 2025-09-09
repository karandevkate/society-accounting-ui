"use client"
import React, { useState } from 'react';
import styles from '@/app/superadmin/[username]/dashboard/page.module.css'; // Import the custom CSS
import global from '@/app/superadmin/superadmin.module.css'
import Image from 'next/image';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [society, setSociety] = useState({
        name: "Green Valley Residency",
        address: "123, Maple Street, NY",
        state: "New York",
        city: "Brooklyn",
    });

    const [editSociety, setEditSociety] = useState({ ...society });

    const handleEditClick = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setEditSociety({ ...society });
    };
    const handleSave = () => {
        setSociety({ ...editSociety });
        setShowModal(false);
    };
    return (
        <div className={global['container']}>
            <h2 className={global['heading']}>Dashboard</h2>

            <div className='row'>
                <div className="col-md-6">
                    <Card className="shadow-lg p-4" style={{ minHeight: "100%" }}>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Society Details</h4>
                            <PencilSquare
                                className="text-primary"
                                size={24}
                                role="button"
                                onClick={handleEditClick}
                            />
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                {/* Left Column - Labels */}
                                <div className="col-md-4 fw-bold text-secondary">
                                    <p>Society Name:</p>
                                    <p>Detail Address:</p>
                                    <p>State:</p>
                                    <p>City:</p>
                                </div>

                                {/* Right Column - Values */}
                                <div className="col-md-8">
                                    <p>{society.name}</p>
                                    <p>{society.address}</p>
                                    <p>{society.state}</p>
                                    <p>{society.city}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Edit Modal */}
                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
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
                            <Button variant="secondary" className="btn btn-danger" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-6">
                            <div className={`${styles['card-custom']} ${styles['card-custom-1']} card`}>
                                <div className="card-body">
                                    <h5 className="card-title">No Society Enrolled</h5>
                                    <h4>0</h4>
                                    <p className="card-content">Total number of societies enrolled</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6">
                            <div className={`${styles['card-custom']} ${styles['card-custom-2']} card`}>
                                <div className="card-body">
                                    <h5 className="card-title">Pending Approval Societies</h5>
                                    <h4>5</h4>
                                    <p className="card-content">Societies awaiting approval</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12 col-sm-6 col-md-6">
                            <div className={`${styles['card-custom']} ${styles['card-custom-3']} card`}>
                                <div className="card-body" >
                                    <h5 className="card-title">Active Societies</h5>
                                    <h4>10</h4>
                                    <p className="card-content">Currently active societies</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6">
                            <div className={`${styles['card-custom']} ${styles['card-custom-4']} card`}>
                                <div className="card-body">
                                    <h5 className="card-title">Total Users</h5>
                                    <h4>120</h4>
                                    <p className="card-content">Total users registered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <hr style={{ border: "2px solid blue" }} />



        </div >
    );
}
