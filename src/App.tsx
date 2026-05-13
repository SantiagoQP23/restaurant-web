import "./App.css";
import NiceModal from "@ebay/nice-modal-react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "./shared/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <NiceModal.Provider>
        <Outlet />
        <TanStackRouterDevtools />
      </NiceModal.Provider>
    </TooltipProvider>
  );
}

export default App;
