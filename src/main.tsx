import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./app/i18n/i18n.config.ts";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router.config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
