import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { AuthProvider } from "./context/AuthContext";

render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);