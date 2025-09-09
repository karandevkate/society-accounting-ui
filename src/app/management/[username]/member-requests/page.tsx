import React from 'react'
import { Metadata } from "next";
import MemberRequest from './MemberRequest';

export const metadata: Metadata = {
    title: "Admin Panel | Member Request"

};
export default function page() {
    return <MemberRequest />
}
