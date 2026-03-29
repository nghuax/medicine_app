import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@shared/data/app-provider";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider
      convexHttpUrl={import.meta.env.VITE_CONVEX_HTTP_URL}
      convexUrl={import.meta.env.VITE_CONVEX_URL}
    >
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
);
