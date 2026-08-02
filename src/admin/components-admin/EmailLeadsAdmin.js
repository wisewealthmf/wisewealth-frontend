import React, { useState, useEffect } from "react";
import {
  adminGetEmailLeads,
  adminUpdateEmailLead,
  adminDeleteEmailLead,
  adminFetchWealthCheckReport,
} from "../../api";
import Toast from "../../components/Toast";
import "./EmailLeadsAdmin.css";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

function EmailLeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const leadsPerPage = 20;

  // Inline saving state: { [id]: true } while a PATCH is in-flight
  const [saving, setSaving] = useState({});
  // PDF loading state: { [id]: true } while the report blob is being fetched
  const [loadingPdf, setLoadingPdf] = useState({});

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetEmailLeads(page - 1, leadsPerPage);
      setLeads(Array.isArray(data) ? data : (data?.content ?? []));
      setTotalPages(data?.totalPages ?? 1);
    } catch (err) {
      setError(err.message || "Failed to load email leads");
    } finally {
      setLoading(false);
    }
  };

  // Toggle a boolean field inline and PATCH immediately
  const toggleField = async (lead, field) => {
    const id = lead.id;
    const newValue = !lead[field];

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: newValue } : l))
    );
    setSaving((prev) => ({ ...prev, [id]: true }));

    try {
      await adminUpdateEmailLead(id, { [field]: newValue });
    } catch (err) {
      // Revert on failure
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, [field]: !newValue } : l))
      );
      setToast({
        message: err.message || "Failed to update lead",
        type: "error",
      });
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const openPdfReport = async (lead) => {
    const id = lead.id;
    setLoadingPdf((prev) => ({ ...prev, [id]: true }));
    try {
      const blob = await adminFetchWealthCheckReport(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setToast({ message: err.message || "Failed to load PDF report", type: "error" });
    } finally {
      setLoadingPdf((prev) => ({ ...prev, [id]: false }));
    }
  };

  const openDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminDeleteEmailLead(leadToDelete.id);
      await fetchLeads(currentPage);
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete lead",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };

  const filteredLeads = leads.filter((l) =>
    (l.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.purpose || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLeads = filteredLeads;

  const hasPurpose = (lead, p) => (lead.purpose || "").split(",").map(s => s.trim()).includes(p);

  const followedUpCount  = leads.filter((l) => l.hasFollowedUp).length;
  const isUserCount      = leads.filter((l) => l.isUser).length;
  const wealthCheckCount = leads.filter((l) => hasPurpose(l, "WEALTH_CHECK")).length;
  const freeGuideCount   = leads.filter((l) => hasPurpose(l, "FREE_GUIDE")).length;
  const bothCount        = leads.filter((l) => hasPurpose(l, "FREE_GUIDE") && hasPurpose(l, "WEALTH_CHECK")).length;

  return (
    <div className="email-leads-admin">
      <div className="el-header">
        <h1>Email Leads</h1>
        <div className="el-stats">
          <span className="el-stat-chip">Total: {leads.length}</span>
          <span className="el-stat-chip el-stat-chip--green">
            Registered users: {isUserCount}
          </span>
          <span className="el-stat-chip el-stat-chip--blue">
            Free Guide: {freeGuideCount}
          </span>
          <span className="el-stat-chip el-stat-chip--orange">
            Wealth Check: {wealthCheckCount}
          </span>
          {bothCount > 0 && (
            <span className="el-stat-chip el-stat-chip--purple">
              Both: {bothCount}
            </span>
          )}
          <span className="el-stat-chip">
            Followed up: {followedUpCount}
          </span>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email…"
        className="search-input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {error && <p className="el-error">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Purpose</th>
              <th>Report</th>
              <th>Is User</th>
              <th>Followed Up</th>
              <th>Captured At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="el-center">Loading…</td>
              </tr>
            ) : currentLeads.length === 0 ? (
              <tr>
                <td colSpan="9" className="el-center">No leads found</td>
              </tr>
            ) : (
              currentLeads.map((lead) => {
                const isSaving = saving[lead.id];
                const isPdfLoading = loadingPdf[lead.id];
                return (
                  <tr key={lead.id} className={isSaving ? "el-row--saving" : ""}>
                    <td>{lead.id}</td>
                    <td>{lead.name || "—"}</td>
                    <td className="el-email">{lead.email}</td>
                    <td>
                      {hasPurpose(lead, "FREE_GUIDE") && hasPurpose(lead, "WEALTH_CHECK") ? (
                        <>
                          <span className="el-badge el-badge--pending" style={{ marginRight: 4 }}>Free Guide</span>
                          <span className="el-badge el-badge--yes">Wealth Check</span>
                        </>
                      ) : hasPurpose(lead, "WEALTH_CHECK") ? (
                        <span className="el-badge el-badge--yes">Wealth Check</span>
                      ) : (
                        <span className="el-badge el-badge--pending">Free Guide</span>
                      )}
                    </td>

                    {/* PDF report link — only for leads that used Wealth Check */}
                    <td>
                      {hasPurpose(lead, "WEALTH_CHECK") ? (
                        <button
                          className="view-btn"
                          onClick={() => openPdfReport(lead)}
                          disabled={isPdfLoading || isSaving}
                          title="View PDF report"
                        >
                          {isPdfLoading ? "Loading…" : "View PDF"}
                        </button>
                      ) : (
                        <span style={{ color: "#aaa" }}>—</span>
                      )}
                    </td>

                    {/* is_user checkbox */}
                    <td>
                      <label className="el-checkbox-label">
                        <input
                          type="checkbox"
                          checked={!!lead.isUser}
                          disabled={isSaving}
                          onChange={() => toggleField(lead, "isUser")}
                        />
                        <span className={`el-badge ${lead.isUser ? "el-badge--yes" : "el-badge--no"}`}>
                          {lead.isUser ? "Yes" : "No"}
                        </span>
                      </label>
                    </td>

                    {/* has_followed_up checkbox */}
                    <td>
                      <label className="el-checkbox-label">
                        <input
                          type="checkbox"
                          checked={!!lead.hasFollowedUp}
                          disabled={isSaving}
                          onChange={() => toggleField(lead, "hasFollowedUp")}
                        />
                        <span className={`el-badge ${lead.hasFollowedUp ? "el-badge--done" : "el-badge--pending"}`}>
                          {lead.hasFollowedUp ? "Done" : "Pending"}
                        </span>
                      </label>
                    </td>

                    <td className="el-date">{formatDate(lead.createdAt)}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(lead)}
                        disabled={isSaving}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && leadToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete Lead?</h3>
            <p>
              Permanently delete <strong>{leadToDelete.email}</strong>?
              This cannot be undone.
            </p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>Delete</button>
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

export default EmailLeadsAdmin;
