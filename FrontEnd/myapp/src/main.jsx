import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ToastContainer position="top-right" autoClose={1000} />
  </QueryClientProvider>
);
