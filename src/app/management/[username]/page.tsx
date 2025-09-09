"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/management/[username]/page.module.css";
import "bootstrap/dist/js/bootstrap.min.js";

function Sidebar({ username }: { username?: string | null }) {
  const [isStaffMenuVisible, setIsStaffMenuVisible] = useState(false);
  const [isMemberListMenuVisible, setIsMemberListMenuVisible] = useState(false);

  return (
    <div className={`p-3 ${styles.sidebar}`}>
      <div className="d-flex align-items-center">
        <Image alt="Logo" src="/logo.png" height={43} width={43} />
        <h2 className="ms-3 text-dark">MySociety</h2>
      </div>
      <div className={styles.scroll}>
        <ul className="nav    mt-3">
          <span className="text-center">
            <small className={styles.small}>Member Management</small>
          </span>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/dashboard`}
            >
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>

          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/member-requests`}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Member Requests
            </Link>
          </li>

          <li className="nav-item mt-2">
            <span
              className={`nav-link ${styles.link} d-flex justify-content-between align-items-center`}
              onClick={() => setIsMemberListMenuVisible(!isMemberListMenuVisible)}
              style={{ cursor: "pointer" }}
            >
              <span>
                <i className="bi bi-people-fill me-2"></i>Member List&nbsp;
              </span>
              <i
                className={`bi ${isMemberListMenuVisible ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
              ></i>
            </span>
            {isMemberListMenuVisible && (
              <ul className="list-unstyled ms-3">
                <li>
                  <Link
                    className={`nav-link ${styles.link}`}
                    href={`/management/${username}/member-list`}
                  >
                    Members List
                  </Link>
                </li>
                <li>
                  <Link
                    className={`nav-link ${styles.link}`}
                    href={`/management/${username}/member-list/committee-members`}
                  >
                    Committee Members
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <ul className="nav    mt-3">
          <span className="text-center">
            <small className={styles.small}>Society Administration</small>
          </span>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/Flat`}
            >
              <i className="bi bi-building me-2"></i>Flats
            </Link>
          </li>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/committee-members`}
            >
              <i className="bi bi-person-lines-fill me-2"></i>Committee Members
            </Link>
          </li>
        </ul>

        <ul className="nav    mt-3">
          <span className="text-center">
            <small className={styles.small}>Staff Management</small>
          </span>
          <li className="nav-item mt-2">
            <span
              className={`nav-link ${styles.link} d-flex justify-content-between align-items-center`}
              onClick={() => setIsStaffMenuVisible(!isStaffMenuVisible)}
              style={{ cursor: "pointer" }}
            >
              <span>
                <i className="bi bi-person-workspace me-2"></i>Staff&nbsp;
              </span>
              <i
                className={`bi ${isStaffMenuVisible ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
              ></i>
            </span>
            {isStaffMenuVisible && (
              <ul className="list-unstyled ms-3">
                <li>
                  <Link
                    className={`nav-link ${styles.link}`}
                    href={`/management/${username}/staff`}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className={`nav-link ${styles.link}`}
                    href={`/management/${username}/staff/salary`}
                  >
                    <i className="bi bi-currency-dollar me-2"></i>Salary
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <ul className="nav    mt-3">
          <span className="text-center">
            <small className={styles.small}>Accounting</small>
          </span>
          <li className="nav-item mt-2">

            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/society-expenses`}
            >
              <i className="bi bi-wallet2 me-2"></i>Society Expenses
            </Link>
          </li>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/bank-statement`}
            >
              <i className="bi bi-bank me-2"></i>Bank Statement
            </Link>
          </li>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/maintenance-bills`}
            >
              <i className="bi bi-receipt me-2"></i>Maintenance Bills
            </Link>
          </li>
          <li className="nav-item mt-2">
            <Link
              className={`nav-link ${styles.link}`}
              href={`/management/${username}/society-journal`}
            >
              <i className="bi bi-journal-text me-2"></i>Society Journal
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
