"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * @param {{ user: import("@/types").User }} props
 */
export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          {/* CLICK AREA */}
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted rounded-lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-left text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuTrigger>

          {/* DROPDOWN */}
          <DropdownMenuContent
            align="end"
            side={isMobile ? "bottom" : "right"}
            className="w-56"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade Plan
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>

              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}