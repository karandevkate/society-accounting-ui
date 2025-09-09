import React from 'react'
import { Metadata } from "next";
import MaintenanceBills from './MaintenanceBills';
export const metadata: Metadata = {
    title: "Admin Panel | Maintenance Bills"

};
export default function page() {
    return <MaintenanceBills />
}
