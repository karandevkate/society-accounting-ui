"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card, Container, Row, Col,
    Button,
    Badge,
    Modal,
    Toast,
    ToastContainer,
    Form
} from "react-bootstrap";
import Select from "react-select";
import { BASE_URL, getFlatNumber, getMemberId, getSocietyId, getSocietyMemberId, } from "@/config/apiConfig";

interface FlatResponseDTO {
    flatNumber: string;
    wing: string;
    flat: string;
    societyId: string;
    societyName: string;
    flatType: string;
    selfOccupied: boolean;
}

interface SocietyResponseDTO {
    societyId: string;
    societyName: string;
}

const MyFlats = () => {
    const [flats, setFlats] = useState<FlatResponseDTO[]>([]);
    const [allSocieties, setAllSocieties] = useState<SocietyResponseDTO[]>([]);
    const [societyFlats, setSocietyFlats] = useState<FlatResponseDTO[]>([]);

    const [selectedSociety, setSelectedSociety] = useState<any>(null);
    const [selectedFlat, setSelectedFlat] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

    const [selectedFlatLocal, setSelectedFlatLocal] = useState<string | null>(null);

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
        const storedFlat = getFlatNumber();
        if (storedFlat) setSelectedFlatLocal(storedFlat);
        fetchMemberFlats();
    }, []);

    const fetchMemberFlats = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/flats/by-society-member/${getSocietyMemberId()}/society/${getSocietyId()}`
            );
            setFlats(response.data || []);
        } catch (error) {
            console.error("Error fetching member properties:", error);
        }
    };

    const fetchAllSocieties = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/society/getAllSocieties`);
            setAllSocieties(response.data || []);
        } catch (error) {
            console.error("Error fetching societies:", error);
        }
    };

    const fetchFlatsBySociety = async (societyId: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/flats/society/` + societyId);
            setSocietyFlats(response.data || []);
        } catch (error) {
            console.error("Error fetching society flats:", error);
        }
    };

    const handleSwitchFlat = async (flatNumber: string, flatSocietyId: string) => {
        if (!getMemberId() || !getSocietyMemberId()) {
            console.error("Missing memberId or societyMemberId");
            return;
        }

        setSelectedFlatLocal(flatNumber);
        localStorage.setItem("flatNumber", flatNumber);
        localStorage.setItem("flatSocietyId", flatSocietyId);

        try {
            await axios.post(`${BASE_URL}/api/members/update-last-visited`, {
                memberId: getMemberId(),
                societyId: flatSocietyId,
                societyMemberId: getSocietyMemberId(),
                flatNumber,
                flatSocietyId,
            });

            window.location.reload();
        } catch (error) {
            console.error("Failed to update last visited flat:", error);
        }
    };


    const handleRegisterProperty = async () => {
        try {
            await axios.post(`${BASE_URL}/members/registerproperty`, {
                flatNumber: selectedFlat?.value,
                societyId: selectedSociety?.value,
                memberId: getMemberId(),
            });
            setToastMsg("Property registered successfully!");
            setToastVariant("success");
            setShowModal(false);
            setSelectedSociety(null);
            setSelectedFlat(null);
            fetchMemberFlats();
        } catch (error: any) {
            console.error("Error registering property:", error);
            const message =
                error.response?.data?.error || "Failed to register property.";
            setToastMsg(message);
            setToastVariant("danger");
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>My Registered Properties</h3>
                <Button
                    variant="success"
                    onClick={() => {
                        fetchAllSocieties();
                        setShowModal(true);
                    }}
                >
                    + Register Property
                </Button>
            </div>

            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setToastMsg(null)}
                    show={!!toastMsg}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">{toastMsg}</Toast.Body>
                </Toast>
            </ToastContainer>

            {flats.length === 0 ? (
                <p className="text-muted">
                    You don’t have any approved properties yet.
                    <br />
                    If you recently registered, your request may still be awaiting approval from the society admin or committee member.
                </p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {flats.map((flat) => {
                        const isActive = selectedFlatLocal === flat.flatNumber;

                        return (
                            <Col key={flat.flatNumber}>
                                <Card className={`shadow-sm rounded-4 ${isActive ? "border-primary bg-warning-subtle text-dark" : ""}`}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <Card.Title className="fw-bold mb-0">
                                                <i className="bi bi-house-fill me-2 text-primary"></i>
                                                {flat.flatNumber}
                                            </Card.Title>
                                            {isActive && <Badge bg="primary">Current</Badge>}
                                        </div>

                                        <Card.Subtitle className="mb-3 text-muted">
                                            <i className="bi bi-building-fill me-1"></i>
                                            {flat.societyName}
                                        </Card.Subtitle>

                                        <Card.Text className="mb-3">
                                            <strong>Wing:</strong> {flat.wing} <br />
                                            <strong>Flat:</strong> {flat.flat} <br />
                                            <strong>Type:</strong> {flat.flatType} <br />
                                            <strong>Self Occupied:</strong>{" "}
                                            {flat.selfOccupied ? "Yes" : "No"}
                                        </Card.Text>

                                        <Button
                                            variant={isActive ? "outline-primary" : "primary"}
                                            className="w-100"
                                            onClick={() => handleSwitchFlat(flat.flatNumber, flat.societyId)}
                                        >
                                            <i className="bi bi-door-open-fill me-2"></i>
                                            {isActive ? "Switched" : "Switch to this property"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Register Property Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Society</Form.Label>
                        <Select
                            options={allSocieties.map((s) => ({
                                value: s.societyId,
                                label: s.societyName,
                            }))}
                            onChange={(option) => {
                                setSelectedSociety(option);
                                setSelectedFlat(null);
                                fetchFlatsBySociety(option?.value);
                            }}
                            placeholder="Search or select society..."
                            value={selectedSociety}
                        />
                    </Form.Group>

                    {selectedSociety && (
                        <Form.Group>
                            <Form.Label>Select Flat</Form.Label>
                            <Select
                                options={societyFlats.map((f) => ({
                                    value: f.flatNumber,
                                    label: `${f.flatNumber} - ${f.flatType}`,
                                }))}
                                onChange={(option) => setSelectedFlat(option)}
                                placeholder="Search or select flat..."
                                value={selectedFlat}
                            />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleRegisterProperty}
                        disabled={!selectedFlat}
                    >
                        Register Property
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyFlats;
