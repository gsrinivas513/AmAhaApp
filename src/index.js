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

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AdUnlockProvider>
              <App />
            </AdUnlockProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);