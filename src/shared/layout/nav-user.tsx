import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Bell,
  Check,
  CreditCard,
  EllipsisVerticalIcon,
  LogOut,
  User2,
} from "lucide-react";
import type { User } from "../models/user.model";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { Restaurant } from "../models/restaurant.model";

interface Props {
  user: User;
}

export function NavUser({ user }: Props) {
  const { isMobile } = useSidebar();
  const { logout } = useAuthStore();
  const restaurant = useAuthStore((state) => state.restaurant);

  const switchRestaurant = useAuth().switchRestaurant;

  const changeRestaurant = (newRestaurant: Restaurant) => {
    if (restaurant?.id !== newRestaurant.id) {
      switchRestaurant.mutate(newRestaurant.id);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* // <Avatar className="h-8 w-8 rounded-lg grayscale"> */}
              {/* //   <AvatarImage src={user.avatar} alt={user.name} /> */}
              {/* //   <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
              {/* // </Avatar> */}
              <User2 size={22} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.username}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.person.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* <Avatar className="h-8 w-8 rounded-lg"> */}
                {/*   <AvatarImage src={user.avatar} alt={user.name} /> */}
                {/*   <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                {/* </Avatar> */}

                <div className="flex justify-center">
                  <User2 />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.person.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            {user?.restaurantRoles.map((role) => (
              <DropdownMenuItem
                onClick={() => changeRestaurant(role.restaurant)}
                key={role.id}
              >
                <User2 />
                {role.restaurant.name}
                {restaurant?.id === role.restaurant.id && <Check />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User2 />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
