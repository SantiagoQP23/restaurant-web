import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home,
  ShoppingBag,
  Soup,
  Table2,
  Users,
  UtensilsCrossed,
  UtensilsCrossedIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { useActiveOrders } from "@/modules/orders/hooks/useActiveOrders";
import {
  useOrderCreatedListener,
  useOrderDeletedListener,
  useOrderUpdatedListener,
} from "@/modules/orders/hooks/useOrders";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { NavUser } from "./nav-user";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { Badge } from "@/shared/components/ui/badge";
import { useIsAdmin } from "@/modules/auth/hooks/useIsAdmin";

const navigation = [
  { label: "Inicio", icon: Home, to: "/app/home" },
  { label: "Pedidos", icon: ShoppingBag, to: "/app/orders" },
  { label: "Producción", icon: Soup, to: "/app/production" },
  { label: "Mesas", icon: Table2, to: "/app/tables" },
  { label: "Menú", icon: UtensilsCrossed, to: "/app/menu" },
  { label: "Usuarios", icon: Users, to: "/app/users", adminOnly: true },
  {
    label: "Restaurante",
    icon: UtensilsCrossedIcon,
    to: "/app/restaurant",
    adminOnly: true,
  },
];

const adminOnlyPaths = navigation
  .filter((item) => item.adminOnly)
  .map((item) => item.to);

export const AppLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const online = useContext(SocketContext).online;
  const isAdmin = useIsAdmin();

  useActiveOrders();

  useOrderCreatedListener();
  useOrderUpdatedListener();
  useOrderDeletedListener();

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" />;
  }

  // Owner/admin screens: other roles get sent to orders, same as the app's
  // Manage tab hiding them.
  if (
    status === "authenticated" &&
    !isAdmin &&
    adminOnlyPaths.some((path) => pathname.startsWith(path))
  ) {
    return <Navigate to="/app/orders" />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1.5">
            <img src="/logo.svg" alt="" className="size-8 shrink-0" />
            <span className="text-base font-bold group-data-[collapsible=icon]:hidden">
              Teikio
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation
                  .filter((item) => isAdmin || !item.adminOnly)
                  .map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={pathname.startsWith(item.to)}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />

          {!online && <Badge variant="destructive">Sin conexión</Badge>}
          {/* <span className="text-sm font-medium text-muted-foreground"> */}
          {/*   Panel principal */}
          {/* </span> */}
        </header>
        <div className="flex min-h-[calc(100svh-3.5rem)] flex-col  p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
