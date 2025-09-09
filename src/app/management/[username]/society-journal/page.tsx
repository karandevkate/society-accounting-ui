import React from 'react'
import SocietyJournal from './SocietyJournal'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin Panel | Expense "
};
export default function page() {
    return <SocietyJournal />
}
