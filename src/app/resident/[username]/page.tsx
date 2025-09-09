"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Select from "react-select";
import axios from "axios";
import styles from "@/app/resident/[username]/page.module.css";
import { BASE_URL, getFlatNumber, getSocietyId } from "@/config/apiConfig";

interface SocietyOption {
   value: string; // societyId
   label: string; // societyName
   societyMemberId: string;
   lastVisitedFlatNumber?: string;
   lastVisitedFlatSocietyId?: string;
}

function Sidebar({ username }: { username?: string }) {
   const pathname = usePathname();
   const [societies, setSocieties] = useState<SocietyOption[]>([]);
   const [selectedSociety, setSelectedSociety] = useState<SocietyOption | null>(null);

   const isActive = (path: string) => pathname === path;

   useEffect(() => {
      const memberId = localStorage.getItem("memberId");
      if (!memberId) return;
      fetchMemberSocieties(memberId);
   }, []);

   const fetchMemberSocieties = async (memberId: string) => {
      try {
         const response = await axios.get(`${BASE_URL}/members/${memberId}/societies`);
         if (!response.data || response.data.length === 0) return;

         const options: SocietyOption[] = response.data.map((s: any) => ({
            value: s.societyId,
            label: s.societyName,
            societyMemberId: s.societyMemberId,
            lastVisitedFlatNumber: s.lastVisitedFlatNumber || null, // ✅ match backend
            lastVisitedFlatSocietyId: s.societyId, // ✅ default societyId
         }));

         setSocieties(options);

         const lastSocietyId = localStorage.getItem("societyId");
         const lastSelected =
            options.find(opt => opt.value === lastSocietyId) ||
            options[0] ||
            null;

         if (!lastSelected) return;

         setSelectedSociety({
            ...lastSelected,
            lastVisitedFlatNumber: getFlatNumber() || lastSelected.lastVisitedFlatNumber,
            lastVisitedFlatSocietyId: getSocietyId() || lastSelected.lastVisitedFlatSocietyId,
         });

         localStorage.setItem("societyId", lastSelected.value);
         localStorage.setItem("societyMemberId", lastSelected.societyMemberId);
         localStorage.setItem("societyName", lastSelected.label);

         if (localStorage.getItem("flatNumber")) {
            localStorage.setItem("flatNumber", localStorage.getItem("flatNumber")!);
            localStorage.setItem("flatSocietyId", localStorage.getItem("flatSocietyId")!);
         } else if (lastSelected.lastVisitedFlatNumber) {
            localStorage.setItem("flatNumber", lastSelected.lastVisitedFlatNumber);
            localStorage.setItem(
               "flatSocietyId",
               lastSelected.lastVisitedFlatSocietyId || lastSelected.value
            );
         }
      } catch (error) {
         console.error("Error fetching societies:", error);
      }
   };

   const handleSocietyChange = async (option: SocietyOption | null) => {
      const memberId = localStorage.getItem("memberId");
      if (!option || !memberId) return;

      setSelectedSociety(option);
      localStorage.setItem("societyId", option.value);
      localStorage.setItem("societyMemberId", option.societyMemberId);
      localStorage.setItem("societyName", option.label);

      // ✅ Update flat info
      if (option.lastVisitedFlatNumber) {
         localStorage.setItem("flatNumber", option.lastVisitedFlatNumber);
         localStorage.setItem("flatSocietyId", option.lastVisitedFlatSocietyId || option.value);
      } else {
         localStorage.removeItem("flatNumber");
         localStorage.removeItem("flatSocietyId");
      }

      try {
         await axios.post(`${BASE_URL}/api/members/update-last-visited`, {
            memberId,
            societyId: option.value,
            societyMemberId: option.societyMemberId,
            flatNumber: option.lastVisitedFlatNumber || null,
            flatSocietyId: option.lastVisitedFlatSocietyId || null,
         });
      } catch (error) {
         console.error("Failed to update last visited society:", error);
      }

      window.location.reload();
   };


   const handleLogout = () => {
      localStorage.clear();
      window.location.href = "/login";
   };

   return (
      <div className={`d-flex flex-column vh-100 p-3 ${styles.sidebar}`}>
         {/* Logo */}
         <div className="d-flex align-items-center mb-3">
            <Image alt="Logo" src="/logo.png" height={43} width={43} />
            <h2 className="ms-3 text-dark">MySociety</h2>
         </div>

         {/* Society Switcher at Top */}
         {/* Society Switcher at Top */}
         <div className="mb-4">
            <span className="text-muted small fw-medium">Switch Society:</span>
            <Select
               options={societies}
               value={selectedSociety}
               onChange={handleSocietyChange}
               placeholder="Select Society"
               isSearchable
               getOptionLabel={(option) => option.label}
               getOptionValue={(option) => option.value}
               styles={{
                  control: (provided, state) => ({
                     ...provided,
                     borderRadius: "15px",
                     minHeight: "42px",
                     border: state.isFocused ? "2px solid #0d6efd" : "1px solid #ced4da",
                     boxShadow: state.isFocused ? "0 4px 12px rgba(13, 110, 253, 0.15)" : "none",
                     transition: "all 0.2s ease",
                     paddingLeft: "12px",
                     fontSize: "0.95rem",
                     cursor: "pointer",
                  }),
                  option: (provided, state) => ({
                     ...provided,
                     backgroundColor: state.isFocused ? "#0d6efd" : "#fff",
                     color: state.isFocused ? "#fff" : "#495057",
                     cursor: "pointer",
                  }),
                  singleValue: (provided) => ({
                     ...provided,
                     color: "#212529",
                     fontWeight: 500,
                  }),
                  placeholder: (provided) => ({
                     ...provided,
                     color: "#6c757d",
                     fontWeight: 500,
                  }),
               }}
            />
         </div>


         {/* Navigation */}
         <div className="flex-grow-1 overflow-auto">
            <ul className="nav flex-column">
               <span className="text-center"><small className={styles.small}>Dashboard Section</small></span>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/dashboard`) ? styles.active : ""}`}
                     href={`/resident/${username}/dashboard`}
                  >
                     <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Link>
               </li>

               <span className="text-center"><small className={styles.small}>My Property</small></span>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/my-flats`) ? styles.active : ""}`}
                     href={`/resident/${username}/my-flats`}
                  >
                     <i className="bi bi-house-door-fill me-2"></i>My Property
                  </Link>
               </li>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/maintenance`) ? styles.active : ""}`}
                     href={`/resident/${username}/maintenance`}
                  >
                     <i className="bi bi-credit-card-fill me-2"></i>Maintenance
                  </Link>
               </li>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/journal`) ? styles.active : ""}`}
                     href={`/resident/${username}/journal`}
                  >
                     <i className="bi bi-journal-text me-2"></i>Journal
                  </Link>
               </li>

               <li className="nav-item mt-4">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/notices`) ? styles.active : ""}`}
                     href={`/resident/${username}/notices`}
                  >
                     <i className="bi bi-bell-fill me-2"></i>Notices
                  </Link>
               </li>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/complaints`) ? styles.active : ""}`}
                     href={`/resident/${username}/complaints`}
                  >
                     <i className="bi bi-exclamation-circle-fill me-2"></i>Complaints
                  </Link>
               </li>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/contact-society`) ? styles.active : ""}`}
                     href={`/resident/${username}/contact-society`}
                  >
                     <i className="bi bi-telephone-fill me-2"></i>Contact Society
                  </Link>
               </li>

               <li className="nav-item mt-2">
                  <Link
                     className={`nav-link ${styles.link} ${isActive(`/resident/${username}/profile`) ? styles.active : ""}`}
                     href={`/resident/${username}/profile`}
                  >
                     <i className="bi bi-person-fill me-2"></i>Profile
                  </Link>
               </li>
            </ul>
         </div>

         {/* Logout Button at Bottom */}
         <div className="mt-auto">
            <button onClick={handleLogout} className="btn btn-danger w-100">
               <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
         </div>
      </div>
   );
}

export default Sidebar;
