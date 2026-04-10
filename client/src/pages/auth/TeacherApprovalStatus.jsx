"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, Loader, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * TEACHER APPROVAL STATUS PAGE
 * Teachers can check their approval status and wait for admin decision
 */
export const TeacherApprovalStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApprovalStatus = useCallback(async () => {
    try {
      const response = await api.get(`/teacher-requests/status/${user._id}`);
      if (response.data.success) {
        setStatus(response.data.approvalStatus);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchApprovalStatus();
    // Poll every 30 seconds
    const interval = setInterval(fetchApprovalStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchApprovalStatus]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Account Approved!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-800">
            Your teacher account has been approved by the administrator. You
            now have full access to the system.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "REJECTED") {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            Request Not Approved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-800">
            Your teacher request was rejected. Please contact the administrator
            for more information.
          </p>
          <Button variant="outline">Contact Administrator</Button>
        </CardContent>
      </Card>
    );
  }

  // PENDING_APPROVAL
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Clock className="w-5 h-5" />
          Awaiting Approval
        </CardTitle>
        <CardDescription>Your application is being reviewed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white border rounded p-4 space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Status:</strong> Pending Review
          </p>
          <p className="text-sm text-gray-600">
            <strong>Submitted:</strong> {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Estimated Wait:</strong> 1-3 business days
          </p>
        </div>

        <div className="bg-blue-100 border border-blue-300 rounded p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>What happens next?</strong>
            <br />
            An administrator will review your qualifications and contact
            information. You will receive a notification once your account
            status changes.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-500">
            Page auto-refreshes every 30 seconds. Feel free to close this page
            and check back later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherApprovalStatus;
