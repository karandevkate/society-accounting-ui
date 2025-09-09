import React from 'react'
import { Metadata } from "next";
import MyFlats from './MyFlats';
export const metadata: Metadata = {
    title: "Resident Dashboard"

};
export default function page() {
    return <MyFlats />
}
