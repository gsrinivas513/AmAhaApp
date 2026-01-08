// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
// Global styles (Tailwind + app overrides)
import "./index.css";
import "./App.css";
import { AuthProvider } from "./components/AuthProvider";
import { ToastProvider } from "./components/Toast";
import { AdUnlockProvider } from "./ads/AdUnlockProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { AppIntegrationProvider } from "./hooks/useAppIntegration";
import { db } from "./firebase/firebaseConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AdUnlockProvider>
              <AppIntegrationProvider firebaseDb={db}>
                <App />
              </AppIntegrationProvider>
            </AdUnlockProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);