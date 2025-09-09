
import React, { useState } from 'react'
import Society from './society'
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Admin Panel | Society"

};
export default function page() {
    return <Society />
}
