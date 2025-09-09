import React from 'react'
import { Metadata } from "next";
import Society from './Society';
export const metadata: Metadata = {
    title: "Society | Super Admin "

};
export default function page() {
    return <Society />
}
