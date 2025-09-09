"use client"
import React, { useState } from 'react'
import global from '@/app/superadmin/superadmin.module.css'

export default function Society() {
    const [societies, setSocieties] = useState([
        { id: 1, society_name: 'Blue Heights ', registrationNo: '12345', address: 'Address 1', pincode: '123456', status: 'Approved' },
        { id: 2, society_name: 'Red Heights', registrationNo: '67890', address: 'Address 2', pincode: '654321', status: 'Inactive' }
    ]);

    const handleApprove = (id: number) => {
        setSocieties(prevSocieties =>
            prevSocieties.map(society =>
                society.id === id ? { ...society, status: 'Approved' } : society
            )
        );
    };

    const handleDeny = (id: number) => {
        setSocieties(prevSocieties =>
            prevSocieties.map(society =>
                society.id === id ? { ...society, status: 'Denied' } : society
            )
        );
    };

    return (
        <div className={global['container']}>
            <h2 className={global['heading']}>Society</h2>
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-bordered table-info'>
                                <thead className='bg-dark'>
                                    <tr>
                                        <th>SrNO</th>
                                        <th>Society Admin</th>
                                        <th>Registration No</th>
                                        <th>Detailed Address</th>
                                        <th>Pincode</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {societies.map((society, index) => (
                                        <tr key={society.id}>
                                            <td>{index + 1}</td>
                                            <td>{society.society_name}</td>
                                            <td>{society.registrationNo}</td>
                                            <td>{society.address}</td>
                                            <td>{society.pincode}</td>
                                            <td>{society.status}</td>
                                            <td>
                                                {society.status === 'Approved' ? (
                                                    <button className='btn btn-danger' onClick={() => handleDeny(society.id)}>Deny</button>
                                                ) : (
                                                    <button className='btn btn-success' onClick={() => handleApprove(society.id)}>Approve</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
