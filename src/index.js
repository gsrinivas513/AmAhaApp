import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./components/AuthProvider";
import { AdUnlockProvider } from "./ads/AdUnlockProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdUnlockProvider>
          <App />
        </AdUnlockProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);