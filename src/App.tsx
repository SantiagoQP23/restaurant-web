import "./App.css";
import { useEffect } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/api/query-client";

export function App() {
  const { status, checkStatus, user } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (status === "checking") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <span className="text-2xl font-bold">Checking authentication...</span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NiceModal.Provider>
          <Outlet />
          <TanStackRouterDevtools />
        </NiceModal.Provider>
        <Toaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
