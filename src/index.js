import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./mobile.css";       // <-- keep this one
import App from "./App";
import { AuthProvider } from "./components/AuthProvider";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./theme/ThemeProvider";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);