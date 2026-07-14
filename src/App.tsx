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
import { SocketProvider } from "./shared/context/SocketContext";

export function App() {
  const { status, checkStatus } = useAuthStore();

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
      <SocketProvider>
        <TooltipProvider>
          <NiceModal.Provider>
            <Outlet />
            <TanStackRouterDevtools position="bottom-left" />
          </NiceModal.Provider>
          <Toaster position="top-center" />
        </TooltipProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
