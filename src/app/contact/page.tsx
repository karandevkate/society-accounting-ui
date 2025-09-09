import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Contact",

};
export default function Contact() {
    return (
        <div className=" container col-md-6 mt-5">
            <div className="card-body shadow-lg p-4">
                <h2 className="text-center text-primary">Contact Us</h2>
                <p className="text-center">Feel free to reach out to us with any inquiries.</p>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                        name="message"
                        className="form-control"
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">Send Message</button>

            </div>
        </div>
    )
}
