if (!process.env.REACT_APP_API_BASE_URL) {
  // Fail loudly in production. In local dev this is expected — the CRA
  // dev server sets the value from .env.local automatically.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[WiseWealth] REACT_APP_API_BASE_URL is not set. " +
      "Add it to your .env or deployment environment variables."
    );
  }
}

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

async function handleResponse(response) {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorBody;
    if (contentType && contentType.includes("application/json")) {
      errorBody = await response.json();
    } else {
      const text = await response.text();
      errorBody = { message: text || response.statusText || "API request failed" };
    }

    const error = new Error(errorBody.message || "API request failed");
    error.status = response.status;
    error.errorType = errorBody.error || null;
    throw error;
  }
  // 204 No Content — return null instead of trying to parse empty body
  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null;
  }
  return response.json();
}

function getAdminToken() {
  return sessionStorage.getItem("adminToken");
}

function adminHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
    ...extra,
  };
}

// ─── Admin: Users ────────────────────────────────────────────────────────────

export async function adminListUsers(page = 0, size = 20) {
  const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&size=${size}`, {
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function adminToggleUserStatus(userId, isActive) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify({ is_active: isActive }),
  });
  return handleResponse(response);
}

// ─── Admin: Consultations ────────────────────────────────────────────────────

export async function adminGetConsultations(page = 0, size = 20) {
  const response = await fetch(`${API_BASE_URL}/admin/consultations?page=${page}&size=${size}`, {
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function adminUpdateConsultationStatus(consultationId, status) {
  const response = await fetch(
    `${API_BASE_URL}/admin/consultations/${consultationId}/status`,
    {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
}

export async function adminCreateConsultationForUser(userId, { name, email, phone, financialGoal }) {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/consultations`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ name, email, phone, financial_goal: financialGoal }),
    }
  );
  return handleResponse(response);
}

// ─── Admin: Queries ──────────────────────────────────────────────────────────

export async function adminGetQueries(page = 0, size = 20) {
  const response = await fetch(`${API_BASE_URL}/admin/queries?page=${page}&size=${size}`, {
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function adminReplyToQuery(queryId, replyText) {
  const response = await fetch(
    `${API_BASE_URL}/admin/queries/${queryId}/reply`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ reply_text: replyText }),
    }
  );
  return handleResponse(response);
}

export async function adminUpdateQueryStatus(queryId, status) {
  const response = await fetch(
    `${API_BASE_URL}/admin/queries/${queryId}/status`,
    {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
}

export async function adminDeleteQuery(queryId) {
  const response = await fetch(`${API_BASE_URL}/admin/queries/${queryId}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function adminDeleteConsultation(consultationId) {
  const response = await fetch(
    `${API_BASE_URL}/admin/consultations/${consultationId}`,
    {
      method: "DELETE",
      headers: adminHeaders(),
    }
  );
  return handleResponse(response);
}

export async function adminDeleteUser(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function createQuery({
  name,
  email,
  phone,
  queryText,
  category = "OTHER",
}) {
  const response = await fetch(`${API_BASE_URL}/queries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      query_text: queryText,
      category,
    }),
  });

  return handleResponse(response);
}

export async function createConsultation({
  name,
  email,
  phone,
  financialGoal,
  notes = "",
}) {
  const response = await fetch(`${API_BASE_URL}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      financial_goal: financialGoal,
      notes,
    }),
  });

  return handleResponse(response);
}

export async function checkEmailVerified(email) {
  const response = await fetch(
    `${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`
  );
  return handleResponse(response);
}

export async function resendVerificationEmail({ name = "", email }) {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
}

export async function registerUser({ name, email, password, phone = "" }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });

  return handleResponse(response);
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
}

// ─── Admin: Wealth Check Reports ─────────────────────────────────────────────

/**
 * Fetches a wealth-check PDF report for a given lead as a Blob.
 * The caller can then create an object URL and open it in a new tab.
 * Throws an error if the report is not found or the request fails.
 */
export async function adminFetchWealthCheckReport(leadId) {
  const response = await fetch(
    `${API_BASE_URL}/admin/wealth-check/reports/${leadId}`,
    { headers: adminHeaders() }
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No report found for this lead.");
    }
    throw new Error("Failed to load report.");
  }
  return response.blob();
}

// ─── Admin: Email Leads ───────────────────────────────────────────────────────

export async function adminGetEmailLeads(page = 0, size = 20) {
  const response = await fetch(`${API_BASE_URL}/admin/email-leads?page=${page}&size=${size}`, {
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

export async function adminUpdateEmailLead(id, fields) {
  const response = await fetch(`${API_BASE_URL}/admin/email-leads/${id}`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify(fields),
  });
  return handleResponse(response);
}

export async function adminDeleteEmailLead(id) {
  const response = await fetch(`${API_BASE_URL}/admin/email-leads/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  return handleResponse(response);
}

// ─── Public: Wealth Check ─────────────────────────────────────────────────────

export async function captureWealthCheckLead(name, email) {
  const response = await fetch(`${API_BASE_URL}/wealth-check/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
}

export async function uploadWealthCheckReport(leadId, email, pdfBlob) {
  const formData = new FormData();
  formData.append("leadId", String(leadId));
  formData.append("email", email);
  formData.append("file", pdfBlob, `${leadId}_${email}.pdf`);
  const response = await fetch(`${API_BASE_URL}/wealth-check/report`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}

// ─── Public: Free Guide ───────────────────────────────────────────────────────

export async function requestFreeGuide(name, email) {
  const response = await fetch(`${API_BASE_URL}/free-guide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  return handleResponse(response);
}
