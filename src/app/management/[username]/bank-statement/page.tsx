import React from 'react'
import { Metadata } from "next";
import BankStatement from './BankStatement';
export const metadata: Metadata = {
    title: "Admin Dashboard"

};
export default function page() {
    return <BankStatement />
}
