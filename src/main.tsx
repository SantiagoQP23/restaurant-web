import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./app/i18n/i18n.config.ts";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router.config.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
);
