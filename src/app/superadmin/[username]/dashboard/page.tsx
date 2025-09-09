import React from 'react'
import { Metadata } from "next";
import Home from './Home';
export const metadata: Metadata = {
    title: "Super Admin Dashboard"

};
export default function page() {
    return <Home />
}
