import React from 'react'
import { Metadata } from "next";
import MembersList from './MemberList';
export const metadata: Metadata = {
    title: "Admin Panel | Member "

};
export default function page() {
    return <MembersList />
}
