import React from 'react'
import { Metadata } from 'next';
import Maintenance from './Maintenace';

export const metadata: Metadata = {
    title: "Bill Collection | Admin Panel"

};
export default function page() {
    return <Maintenance />
}
