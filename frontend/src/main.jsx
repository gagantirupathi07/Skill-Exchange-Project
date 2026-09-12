import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/index.css";
import "./styles/Layout.css";
import "./styles/Navbar.css";
import "./styles/Sidebar.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/matches.css";
import "./styles/profile.css";
import "./styles/publicProfile.css";
import "./styles/skills.css";
import "./styles/exchangeRequests.css";
import "./styles/modal.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);