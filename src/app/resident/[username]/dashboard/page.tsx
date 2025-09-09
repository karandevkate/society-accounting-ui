import React from 'react'
import { Metadata } from "next";
import Dashboard from './Dashboard';
export const metadata: Metadata = {
    title: "Resident Dashboard"

};
export default function page() {
    return <Dashboard />
}
