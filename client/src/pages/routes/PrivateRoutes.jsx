import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Appsidebar";
import { useAuth } from "@/context/AuthContext";

const PrivateRoutes = () => {

  const { loading, user } = useAuth();


  // Show loader while fetching user data
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If academic year data is missing, simply proceed without forced redirect
  // This ensures users are taken to the default protected route (/dashboard) after login
  // You can handle year loading elsewhere if needed.
  // No redirect here.


  // Render sidebar layout with outlet
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        {/* Global Mobile Topbar */}
        <header className="md:hidden flex h-14 items-center gap-2 border-b-0 bg-indigo-600 px-4 shrink-0 transition-all shadow-md">
           <SidebarTrigger className="-ml-1 text-white hover:bg-indigo-500" />
           <span className="font-bold text-sm tracking-widest uppercase italic text-white">Menu</span>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateRoutes;