import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import ToolsPage from "./components/ToolsPage";
import HomeAdmin from "./admin/components-admin/HomeAdmin";
import LoginAdmin from "./admin/components-admin/LoginAdmin";
import QueriesAdmin from "./admin/components-admin/QueriesAdmin";
import ConsultationsAdmin from "./admin/components-admin/ConsultationsAdmin";
import UsersAdmin from "./admin/components-admin/UsersAdmin";
import ProtectedRoute from "./admin/components-admin/ProtectedRoute";
import EmailLeadsAdmin from "./admin/components-admin/EmailLeadsAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin Route */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/queries"
          element={
            <ProtectedRoute>
              <QueriesAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/consultations"
          element={
            <ProtectedRoute>
              <ConsultationsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UsersAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/email-leads"
          element={
            <ProtectedRoute>
              <EmailLeadsAdmin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;