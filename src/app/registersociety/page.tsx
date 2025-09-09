import React from 'react'
import { Metadata } from "next";
import RegisterSociety from './RegisterSociety';
export const metadata: Metadata = {
    title: "Register Society"

};
export default function page() {
    return <RegisterSociety />
}
