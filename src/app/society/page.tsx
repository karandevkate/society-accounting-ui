"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface Society {
  societyId: string;
  societyName: string;
  zone: string;
  pincode: string;
}

interface SocietyMemberResponse {
  societyMemberId: string;
  societyId: string;
  societyName: string;
  societyUniqueCode: string;
  role: string;
}

export default function SocietyPage() {
  const router = useRouter();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [allSocieties, setAllSocieties] = useState<Society[]>([]);
  const [selectedSociety, setSelectedSociety] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [registrationSocietyId, setRegistrationSocietyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      toast.error("Please log in to access this page.");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) return;

    try {
      const memberResponse = await axios.get<SocietyMemberResponse[]>(
        `http://localhost:8081/members/${memberId}/societies`
      );

      if (memberResponse.status === 200 && memberResponse.data.length > 0) {
        const filtered = memberResponse.data.map((sm) => ({
          societyId: sm.societyId,
          societyName: sm.societyName,
          zone: "",
          pincode: "",
        }));
        setSocieties(filtered);
      } else {
        setSocieties([]);
        toast.info("No registered societies found.");
      }

      const allSocietiesResponse = await axios.get("http://localhost:8081/society/getAllSocieties");
      if (allSocietiesResponse.status === 200) {
        const allSocietiesFiltered = allSocietiesResponse.data.map((society: any) => ({
          societyId: society.societyId,
          societyName: society.societyName,
          zone: society.zone,
          pincode: society.pincode,
        }));
        setAllSocieties(allSocietiesFiltered);
      }
    } catch (error) {
      console.error("Error fetching societies:", error);
      toast.error("Failed to load societies.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocietyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const societyId = event.target.value;
    setSelectedSociety(societyId);

    const memberId = localStorage.getItem("memberId");
    if (!memberId) return;

    try {
      const response = await axios.get<SocietyMemberResponse[]>(
        `http://localhost:8081/members/${memberId}/societies`
      );

      if (response.status === 200) {
        const matched = response.data.find(sm => sm.societyId === societyId);
        if (matched) {
          const role = matched.role.toLowerCase();
          setSelectedRole(role);
          localStorage.setItem("societyId", matched.societyId);
          localStorage.setItem("societyMemberId", matched.societyMemberId);
        }
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      toast.error("Failed to fetch role for selected society.");
    }
  };

  const handleSubmit = () => {
    const memberId = localStorage.getItem("memberId");

    if (!selectedRole || !selectedSociety) {
      toast.error("Missing required information.");
      return;
    }

    if (selectedRole === "admin") {
      router.push(`/management/${memberId}/dashboard`);
    } else {
      router.push(`/resident/${memberId}/dashboard`);
    }
  };

  const handleRegisterSociety = async (e: React.FormEvent) => {
    e.preventDefault();
    const memberId = localStorage.getItem("memberId");
    if (!memberId || !registrationSocietyId) {
      toast.error("Missing data for registration.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8081/members/register-society`, {
        memberId,
        societyId: registrationSocietyId,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Successfully registered to society.");
        setShowModal(false);
        setRegistrationSocietyId("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed.");
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center bg-light">
      <ToastContainer />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <h3 className="card-title mb-4 text-center fw-bold">
                  <i className="bi bi-house-door-fill me-2 text-primary" />
                  Select Your Society
                </h3>

                {isLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : societies.length === 0 ? (
                  <div className="alert alert-warning text-center">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5 text-warning"></i>
                    No registered societies found or your request has not been approved yet.
                    <br />
                    <small className="text-muted">Please contact your society admin for approval.</small>
                    <div className="mt-3">
                      <button className="btn btn-outline-primary rounded-pill" onClick={() => setShowModal(true)}>
                        <i className="bi bi-building-add me-1"></i> Register for Society
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="societySelect" className="form-label fw-semibold">
                        <i className="bi bi-arrow-down-circle me-2 text-secondary" />
                        Choose your Society
                      </label>
                      <select
                        id="societySelect"
                        className="form-select form-select-lg rounded-3"
                        value={selectedSociety}
                        onChange={handleSocietyChange}
                      >
                        <option value="" disabled>Select a society</option>
                        {societies.map((society) => (
                          <option key={society.societyId} value={society.societyId}>
                            {society.societyName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-primary w-50 me-2 rounded-pill"
                        onClick={handleSubmit}
                        disabled={!selectedSociety}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Submit
                      </button>
                      <button
                        className="btn btn-outline-secondary w-50 rounded-pill"
                        onClick={() => setShowModal(true)}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Register Society
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">
                  <i className="bi bi-building-add me-2" />
                  Register for a Society
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleRegisterSociety}>
                  <div className="mb-3">
                    <label htmlFor="registerSocietySelect" className="form-label fw-semibold">
                      Select Society
                    </label>
                    <select
                      id="registerSocietySelect"
                      className="form-select"
                      value={registrationSocietyId}
                      onChange={(e) => setRegistrationSocietyId(e.target.value)}
                    >
                      <option value="" disabled>Select a society</option>
                      {allSocieties.map((society) => (
                        <option key={society.societyId} value={society.societyId}>
                          {`${society.societyName} (${society.zone}, ${society.pincode})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!registrationSocietyId}>
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
