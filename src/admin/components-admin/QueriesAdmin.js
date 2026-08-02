import React, { useState, useEffect } from "react";
import {
  adminGetQueries,
  adminReplyToQuery,
  adminUpdateQueryStatus,
  adminDeleteQuery,
} from "../../api";
import Toast from "../../components/Toast";
import "./QueriesAdmin.css";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const QUERY_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "REPLIED",
  "CLIENT_CONFIRMED",
  "CLOSED",
];

function QueriesAdmin() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const queriesPerPage = 20;

  useEffect(() => {
    fetchQueries(currentPage);
  }, [currentPage]);

  const fetchQueries = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetQueries(page - 1, queriesPerPage);
      setQueries(Array.isArray(data) ? data : (data?.content ?? []));
      setTotalPages(data?.totalPages ?? 1);
    } catch (err) {
      setError(err.message || "Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (query) => {
    setSelectedQuery(query);
    setReplyText(query.reply || "");
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    const id = selectedQuery.queryId ?? selectedQuery.query_id;
    try {
      await adminReplyToQuery(id, replyText);
      await fetchQueries(currentPage);
    } catch (err) {
      setToast({
        message: err.message || "Failed to send reply",
        type: "error",
      });
    } finally {
      setShowReplyModal(false);
      setSelectedQuery(null);
      setReplyText("");
    }
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setSelectedQuery(null);
    setReplyText("");
  };

  const openStatusEdit = (query) => {
    const id = query.queryId ?? query.query_id;
    setEditingStatusId(id);
    setNewStatus(query.status || "NEW");
  };

  const saveStatus = async (id) => {
    try {
      await adminUpdateQueryStatus(id, newStatus);
      await fetchQueries(currentPage);
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
    setQueryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminDeleteQuery(queryToDelete);
      await fetchQueries(currentPage);
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete query",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setQueryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQueryToDelete(null);
  };

  const filteredQueries = queries.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      (q.name || "").toLowerCase().includes(term) ||
      (q.email || "").toLowerCase().includes(term) ||
      (q.phone || "").toLowerCase().includes(term) ||
      (q.queryText || q.query_text || "").toLowerCase().includes(term) ||
      (q.category || "").toLowerCase().includes(term)
    );
  });

  const currentQueries = filteredQueries;

  return (
    <div className="queries-admin">
      <div className="queries-header">
        <h1>Queries Management</h1>
      </div>

      <input
        type="text"
        placeholder="Search queries..."
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
              <th>Query ID</th>
              <th>User ID</th>
              <th>Consultation ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Query</th>
              <th>Reply</th>
              <th>Status</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredQueries.length === 0 ? (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>
                  No queries found
                </td>
              </tr>
            ) : (
              currentQueries.map((q) => {
                const id = q.queryId ?? q.query_id;
                const uId = q.userId ?? q.user_id;
                const cId = q.consultationId ?? q.consultation_id;
                const queryText = q.queryText ?? q.query_text;
                const createdAt = q.createdAt ?? q.created_at;
                const updatedAt = q.updatedAt ?? q.updated_at;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{uId}</td>
                    <td>{cId}</td>
                    <td>{q.name}</td>
                    <td>{q.email}</td>
                    <td>{q.phone}</td>
                    <td>{queryText}</td>
                    <td>{q.reply}</td>
                    <td>
                      {editingStatusId === id ? (
                        <>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                          >
                            {QUERY_STATUSES.map((s) => (
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
                        q.status
                      )}
                    </td>
                    <td>{q.category}</td>
                    <td>{formatDate(createdAt)}</td>
                    <td>{formatDate(updatedAt)}</td>
                    <td>
                      <button
                        className="reply-btn"
                        onClick={() => openReplyModal(q)}
                      >
                        Reply
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => openStatusEdit(q)}
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
      </div>

      {showReplyModal && (
        <div className="modal-overlay">
          <div className="reply-modal">
            <h3>Reply to Query</h3>
            <div className="query-preview">
              <strong>User Query:</strong>
              <p>{selectedQuery?.queryText ?? selectedQuery?.query_text}</p>
            </div>
            <textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeReplyModal}>
                Cancel
              </button>
              <button className="send-btn" onClick={sendReply}>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Remove Query?</h3>
            <p>This will remove it from view.</p>
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

export default QueriesAdmin;
