import { Metadata } from 'next';
import React from 'react'
import Salary from './Salary';


export const metadata: Metadata = {
    title: "Admin Panel | Salary "
};
export default function page() {
    return <Salary />
}
