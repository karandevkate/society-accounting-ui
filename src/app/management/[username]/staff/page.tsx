
import 'react-toastify/dist/ReactToastify.css';

import Staff from './staff';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Admin Panel | Staff Management"

};
export default function page() {
   return <Staff />
}
