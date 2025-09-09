import React from 'react'
import SocietyExpense from './SocietyExpense'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Panel | Expense "
};
export default function page() {
    return <SocietyExpense />
}
