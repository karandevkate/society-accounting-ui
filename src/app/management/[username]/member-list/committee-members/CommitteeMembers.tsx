"use client"
import React, { useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";

export default function CommitteeMembers() {
  const [show, setShow] = useState(false);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", wing: "", flatNo: "", role: "" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: any) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };



  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleShow}>
          Add Committee
        </Button>
      </div>

      {/* Committee Members Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name of Staff</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </Table>

      {/* Add Committee Member Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Committee Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Search Member</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control type="text" placeholder="Search" name="name" value={newMember.name} onChange={handleChange} />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Wing & Flat No.</Form.Label>
              <Form.Control type="text" placeholder="Enter Wing & Flat No." name="wing" value={newMember.wing} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={newMember.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="President">President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">
            Add Member
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
