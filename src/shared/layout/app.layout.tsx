import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  CreditCard,
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

const navigation = [
  { label: "Inicio", icon: Home, to: "/app/home" },
  { label: "Pedidos", icon: ShoppingBag, to: "/app/orders" },
  { label: "Producción", icon: Soup, to: "/app/production" },
  { label: "Mesas", icon: Table2, to: "/app/tables" },
  { label: "Menu", icon: UtensilsCrossed, to: "/app/menu" },
  { label: "Usuarios", icon: Users, to: "/app/users" },
  { label: "Pagos", icon: CreditCard, to: "/app/payments" },
  { label: "Restaurante", icon: UtensilsCrossedIcon, to: "/app/restaurant" },
];

export const AppLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  useActiveOrders();

  useOrderCreatedListener();
  useOrderUpdatedListener();
  useOrderDeletedListener();

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 rounded-3xl bg-sidebar-accent/50 px-3 py-2">
            <div className="grid size-9 place-items-center rounded-2xl  text-primary">
              <UtensilsCrossed className="size-4" />
            </div>
            {/* <div className="flex flex-col text-xs"> */}
            {/*   <span className="font-semibold">Restaurant OS</span> */}
            {/*   <span className="text-sidebar-foreground/60">Panel</span> */}
            {/* </div> */}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
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
