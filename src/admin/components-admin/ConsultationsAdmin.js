import React, { useState, useEffect } from "react";
import {
  adminGetConsultations,
  adminCreateConsultationForUser,
  adminUpdateConsultationStatus,
  adminDeleteConsultation,
} from "../../api";
import Toast from "../../components/Toast";
import "./ConsultationsAdmin.css";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const CONSULTATION_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "APPOINTMENT_CONFIRMED",
  "CLIENT_CONFIRMED",
  "CLOSED",
];

function ConsultationsAdmin() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [financialGoal, setFinancialGoal] = useState("");
  const [notes, setNotes] = useState("");

  // For inline status update
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const consultationsPerPage = 20;

  useEffect(() => {
    fetchConsultations(currentPage);
  }, [currentPage]);

  const fetchConsultations = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetConsultations(page - 1, consultationsPerPage);
      setConsultations(Array.isArray(data) ? data : (data?.content ?? []));
      setTotalPages(data?.totalPages ?? 1);
    } catch (err) {
      setError(err.message || "Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const addConsultation = async () => {
    if (!userId || !name || !email || !phone || !financialGoal) {
      setToast({ message: "Fill all required fields", type: "error" });
      return;
    }
    try {
      await adminCreateConsultationForUser(userId, {
        name,
        email,
        phone,
        financialGoal,
      });
      await fetchConsultations(currentPage);
      setName("");
      setEmail("");
      setPhone("");
      setUserId("");
      setFinancialGoal("");
      setNotes("");
    } catch (err) {
      setToast({
        message: err.message || "Failed to create consultation",
        type: "error",
      });
    }
  };

  const openStatusEdit = (consultation) => {
    const id = consultation.consultationId ?? consultation.consultation_id;
    setEditingStatusId(id);
    setNewStatus(consultation.status || "NEW");
  };

  const saveStatus = async (id) => {
    try {
      await adminUpdateConsultationStatus(id, newStatus);
      await fetchConsultations(currentPage);
    } catch (err) {
      setToast({
        message: err.message || "Failed to update status",
        type: "error",
      });
    } finally {
      setEditingStatusId(null);
      setNewStatus("");
    }
  };

  const openDeleteModal = (id) => {
    setConsultationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminDeleteConsultation(consultationToDelete);
      await fetchConsultations(currentPage);
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete consultation",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setConsultationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setConsultationToDelete(null);
  };

  const filteredConsultations = consultations.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(term) ||
      (c.email || "").toLowerCase().includes(term) ||
      (c.phone || "").toLowerCase().includes(term) ||
      (c.financialGoal || c.financial_goal || "").toLowerCase().includes(term)
    );
  });

  const currentConsultations = filteredConsultations;

  return (
    <div className="consultations-admin">
      <div className="consultations-header">
        <h1>Consultations Management</h1>
      </div>

      <input
        type="text"
        placeholder="Search consultations..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Financial Goal</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredConsultations.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  No consultations found
                </td>
              </tr>
            ) : (
              currentConsultations.map((c) => {
                const id = c.consultationId ?? c.consultation_id;
                const uId = c.userId ?? c.user_id;
                const goal = c.financialGoal ?? c.financial_goal;
                const createdAt = c.createdAt ?? c.created_at;
                const updatedAt = c.updatedAt ?? c.updated_at;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{uId}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{goal}</td>
                    <td>{c.notes}</td>
                    <td>
                      {editingStatusId === id ? (
                        <>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                          >
                            {CONSULTATION_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            className="edit-btn"
                            onClick={() => saveStatus(id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingStatusId(null)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        c.status
                      )}
                    </td>
                    <td>{formatDate(createdAt)}</td>
                    <td>{formatDate(updatedAt)}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openStatusEdit(c)}
                      >
                        Status
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      <div className="consultation-form">
        <h3>Create Consultation for User</h3>
        <input
          type="number"
          placeholder="User ID *"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Financial Goal *"
          value={financialGoal}
          onChange={(e) => setFinancialGoal(e.target.value)}
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button onClick={addConsultation}>Add Consultation</button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Remove Consultation?</h3>
            <p>This will remove it from view. This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ConsultationsAdmin;
