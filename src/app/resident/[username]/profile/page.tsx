import React from 'react'
import { Metadata } from "next";
import Profile from './profile';
export const metadata: Metadata = {
    title: "My Profile | My Society"

};
export default function page() {
    return <Profile />
}
