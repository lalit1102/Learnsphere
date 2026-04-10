"use client";

import {
  LogOut,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/NavMain";
import { NavUser } from "@/components/sidebar/NavUser";
import { TeamSwitcher } from "@/components/sidebar/TeamSwitcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { sidebardata } from "./sidebar-data";

export function AppSidebar(props) {
  const { user, year, setUser } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navigate = useNavigate();

  const userRole = user?.role || "student";

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "",
  };

  // 🔥 Filter + Active logic
  const filteredNav = useMemo(() => {
    return sidebardata.navMain
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        const isChildActive = item.items?.some(
          (sub) => sub.url === pathname
        );
        const isMainActive = item.url === pathname;

        return {
          ...item,
          isActive: isMainActive || isChildActive,
          items: item.items
            ?.filter(
              (subItem) =>
                !subItem.roles || subItem.roles.includes(userRole)
            )
            .map((subItem) => ({
              ...subItem,
              isActive: subItem.url === pathname,
            })),
        };
      });
  }, [pathname, userRole]);

  // 🚪 Logout
  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <TeamSwitcher
          teams={sidebardata.teams}
          yearName={year?.name || "2025-26"}
        />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div
          className={cn(
            "gap-2",
            isCollapsed ? "flex flex-col" : "flex justify-between"
          )}
        >
          <SidebarMenuItem title="Logout">
            <Button onClick={logout} variant="ghost" size="icon">
              <LogOut />
            </Button>
          </SidebarMenuItem>

          <ThemeToggle />
        </div>

        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}