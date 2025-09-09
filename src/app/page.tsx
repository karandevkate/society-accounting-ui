"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import styles from "@/app/page.module.css";

export default function Home() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className="mt-3">
      {/* Hero Section */}
      <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start px-5">
          <h1 className="fw-bold mb-3">
            Complete <span className={styles.greenHighlight}>Society Management</span> Solutions
          </h1>
          <p className="text-muted fs-5">
            Simplify maintenance, staff, and resource management with our all-in-one platform.
          </p>
          <Link href="/registersociety" className="btn btn-primary btn-lg mt-3 shadow">
            <i className="bi bi-pencil-square me-2"></i> Register Your Society
          </Link>
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner rounded-4 shadow">
              <div className="carousel-item active">
                <Image src="/1.jpg" width={750} height={500} alt="Society Maintenance" className="d-block w-100" />
              </div>
              <div className="carousel-item">
                <Image src="/2.jpg" width={750} height={500} alt="Staff Management" className="d-block w-100" />
              </div>
              <div className="carousel-item">
                <Image src="/3.jpg" width={750} height={500} alt="Community Services" className="d-block w-100" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="container my-5">
        <h2 className="text-center fw-bold display-4 mb-4">Our Services</h2>
        <div className="row g-4 justify-content-center">
          {[
            { src: "/image.png", title: "Maintenance Collection", desc: "Track and collect maintenance from residents easily." },
            { src: "/staff.png", title: "Staff Management", desc: "Manage staff schedules, payments, and attendance." },
            { src: "/resources.png", title: "Resource Management", desc: "Handle shared amenities like parking and halls." },
          ].map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 text-center border-0 shadow rounded-4 p-4">
                <Image src={item.src} width={80} height={80} alt={item.title} className="mx-auto mb-3" />
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container my-5" style={{ maxWidth: "800px" }}>
        <h2 className="text-center fw-bold display-5 mb-4">FAQs</h2>
        <div className="accordion" id="faqAccordion">
          {/* FAQ 1 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${styles.accordionButton}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                <i className="bi bi-question-circle me-2 text-primary"></i> How to Register Your Society?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <ol>
                  <li>Go to the <Link href="/registersociety" className="text-primary fw-bold">Society Registration Page</Link>.</li>
                  <li>Enter admin details and create an account.</li>
                  <li>Fill out society information and submit.</li>
                  <li>Wait for approval. Start managing your society!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* FAQ 2 */}
          <div className="accordion-item mt-3">
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${styles.accordionButton}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                <i className="bi bi-gear me-2 text-success"></i> What services does MySociety offer?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <ul>
                  <li><strong>Maintenance:</strong> Track dues, generate bills, and record payments.</li>
                  <li><strong>Staff:</strong> Maintain staff attendance and payroll.</li>
                  <li><strong>Resources:</strong> Book shared spaces like clubhouse or parking.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
