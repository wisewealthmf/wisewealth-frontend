import React, { useState, useEffect } from "react";
import {
  adminListUsers,
  adminToggleUserStatus,
  adminDeleteUser,
} from "../../api";
import Toast from "../../components/Toast";
import "./UsersAdmin.css";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminListUsers(page - 1, usersPerPage);
      setUsers(Array.isArray(data) ? data : (data?.content ?? []));
      setTotalPages(data?.totalPages ?? 1);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openToggleModal = (user) => {
    setUserToToggle(user);
    setShowDeleteModal(true);
  };

  const confirmToggle = async () => {
    if (!userToToggle) return;
    try {
      await adminToggleUserStatus(
        userToToggle.userId ?? userToToggle.user_id,
        !(userToToggle.isActive ?? userToToggle.is_active),
      );
      await fetchUsers(currentPage);
      if (
        selectedUser &&
        (selectedUser.userId ?? selectedUser.user_id) ===
          (userToToggle.userId ?? userToToggle.user_id)
      ) {
        setSelectedUser(null);
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to update user status",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setUserToToggle(null);
    }
  };

  const cancelToggle = () => {
    setShowDeleteModal(false);
    setUserToToggle(null);
  };

  const openConfirmDeleteModal = (user) => {
    setUserToDelete(user);
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await adminDeleteUser(userToDelete.userId ?? userToDelete.user_id);
      await fetchUsers(currentPage);
      if (
        selectedUser &&
        (selectedUser.userId ?? selectedUser.user_id) ===
          (userToDelete.userId ?? userToDelete.user_id)
      ) {
        setSelectedUser(null);
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete user",
        type: "error",
      });
    } finally {
      setShowConfirmDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const phone = user.phone || "";
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      phone.includes(searchTerm)
    );
  });

  return (
    <div className="users-admin">
      <h1>Users Management</h1>

      <input
        type="text"
        placeholder="Search users..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedUser && (
        <div className="user-details-card">
          <h3>User Details</h3>
          <p>
            <strong>User ID:</strong>{" "}
            {selectedUser.userId ?? selectedUser.user_id}
          </p>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser.phone}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {(selectedUser.isActive ?? selectedUser.is_active)
              ? "Active"
              : "Inactive"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {formatDate(selectedUser.createdAt ?? selectedUser.created_at)}
          </p>
          <button className="close-btn" onClick={() => setSelectedUser(null)}>
            Close
          </button>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const id = user.userId ?? user.user_id;
                const isActive = user.isActive ?? user.is_active;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{isActive ? "Active" : "Inactive"}</td>
                    <td>{formatDate(user.createdAt ?? user.created_at)}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                      <button
                        className={isActive ? "delete-btn" : "edit-btn"}
                        onClick={() => openToggleModal(user)}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => openConfirmDeleteModal(user)}
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

      {showDeleteModal && userToToggle && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>
              {(userToToggle.isActive ?? userToToggle.is_active)
                ? "Deactivate User?"
                : "Activate User?"}
            </h3>
            <p>
              Are you sure you want to{" "}
              {(userToToggle.isActive ?? userToToggle.is_active)
                ? "deactivate"
                : "activate"}{" "}
              <strong>{userToToggle.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelToggle}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmToggle}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete User?</h3>
            <p>
              Are you sure you want to permanently delete{" "}
              <strong>{userToDelete.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
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

export default UsersAdmin;
