import React from 'react'
import { Metadata } from "next";
import CommitteeMembers from './CommitteeMembers';
export const metadata: Metadata = {
    title: "Admin Dashboard"

};
export default function page() {
    return <CommitteeMembers />
}
