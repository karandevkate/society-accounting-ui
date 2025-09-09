import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
import Flat from './Flat';

export const metadata: Metadata = {
    title: "Admin Panel | Flat "

};
export default function page() {
    return <Flat />

}
