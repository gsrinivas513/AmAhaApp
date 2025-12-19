import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./mobile.css";       // <-- keep this one
import App from "./App";
import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles/ui.css";
import "./styles/typography.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);