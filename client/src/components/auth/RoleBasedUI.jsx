"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useShowFor } from "@/components/auth/roleHelpers";
import { AlertCircle } from "lucide-react";

/**
 * ============================================
 * ROLE GUARD COMPONENT
 * ============================================
 * Wraps components that should only render for specific roles
 */
export const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const { user } = useAuth();

  if (!user) return fallback;

  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 items-center">
        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
        <p className="text-yellow-800 text-sm font-medium">
          You don't have access to this feature.
        </p>
      </div>
    );
  }

  return children;
};

/**
 * ============================================
 * ROLE BUTTON COMPONENT
 * ============================================
 */
export const RoleButton = ({
  roles = [],
  children,
  onClick,
  className = "",
  disabled = false,
  title = "",
}) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={className}
    >
      {children}
    </button>
  );
};

/**
 * ============================================
 * SHOW IF ROLE COMPONENT
 * ============================================
 */
export const ShowIfRole = ({ role, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return fallback;
  }

  return children;
};

export default RoleGuard;
