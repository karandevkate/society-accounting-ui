import React from 'react'
import { Metadata } from 'next';
import ResidentJournal from './ResidentJournal';

export const metadata: Metadata = {
   title: "User | Journal "
};
export default function page() {
   return <ResidentJournal />
}
