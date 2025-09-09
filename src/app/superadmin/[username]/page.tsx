"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/superadmin/[username]/page.module.css";

export default function Sidebar({ username }: { username?: string }) {

   return (
      <div className={`p-3 ${styles.sidebar}`}>
         <div className="d-flex align-items-center ">
            <Image alt="Logo" src="/logo.png" height={43} width={43} />
            <h2 className="ms-3 text-dark fw-bold">MySociety</h2>
         </div>
         <div className={styles.scroll}>
            <ul className="nav flex-column mt-3">
               <small className={styles.small}>Dashboard</small>
               <li className="nav-item mt-2">
                  <Link className={`nav-link ${styles.link}`} href={`/superadmin/${username}/dashboard`}>
                     <i className="bi bi-house-fill me-2"></i>Home
                  </Link>
               </li>
            </ul>
            <ul className="nav flex-column mt-3">
               <small className={styles.small}>Society Section</small>
               <li className="nav-item mt-2">
                  <Link className={`nav-link ${styles.link}`} href={`/superadmin/${username}/society`}>
                     <i className="bi bi-building-fill me-2"></i>Society
                  </Link>
               </li>
               <li className="nav-item mt-2">
                  <Link className={`nav-link ${styles.link}`} href={`/superadmin/${username}/admin`}>
                     <i className="bi bi-person-gear me-2"></i>Admin
                  </Link>
               </li>
            </ul>
            <ul className="nav flex-column mt-3">
               <small className={styles.small}>Super Admin</small>
               <li className="nav-item mt-2">
                  <Link className={`nav-link ${styles.link}`} href={`/superadmin/${username}/manage-superadmin`}>
                     <i className="bi bi-gear-fill me-2"></i>Manage SuperAdmin
                  </Link>
               </li>
               <li className="nav-item mt-2">
                  <Link className={`nav-link ${styles.link}`} href={`/superadmin/${username}/notifications`}>
                     <i className="bi bi-bell-fill me-2"></i>Notifications
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   );
}