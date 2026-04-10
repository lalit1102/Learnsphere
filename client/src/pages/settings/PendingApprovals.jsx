"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Loader, AlertCircle, User, Calendar, Mail, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const PendingApprovalsAdmin = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher-requests/admin/teacher-requests");
      if (response.data.success) {
        setRequests(response.data.data || []);
      }
    } catch {
      toast.error("Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchPendingRequests();
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
        <div className="flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="font-semibold text-destructive">Access Denied: Admins Only</p>
        </div>
      </div>
    );
  }

  const handleApprove = async (requestId) => {
    setApproving((prev) => ({ ...prev, [requestId]: true }));
    try {
      const response = await api.post(`/teacher-requests/approve/${requestId}`, {
        assignedClasses: [],
        assignedSubjects: [],
      });
      if (response.data.success) {
        toast.success("Teacher approved successfully!");
        setRequests(requests.filter((r) => r._id !== requestId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    } finally {
      setApproving((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return toast.error("Reason is required");
    setApproving((prev) => ({ ...prev, [selectedRequest._id]: true }));
    try {
      const response = await api.post(`/teacher-requests/reject/${selectedRequest._id}`, { rejectionReason });
      if (response.data.success) {
        toast.success("Request rejected");
        setRequests(requests.filter((r) => r._id !== selectedRequest._id));
        setShowRejectDialog(false);
      }
    } catch (error) {
      toast.error("Failed to reject");
    } finally {
      setApproving((prev) => ({ ...prev, [selectedRequest._id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Approvals</h1>
        <p className="text-muted-foreground italic">Manage incoming teaching staff applications</p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-accent/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
            <CheckCircle className="w-10 h-10 text-primary opacity-50" />
            <p className="text-muted-foreground font-medium">All caught up! No pending requests.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead>Teacher Details</TableHead>
                <TableHead>Qualifications</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id} className="hover:bg-accent/30 transition-colors border-b border-border/40">
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <User className="w-4 h-4 text-primary" />
                        {request.teacherName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {request.teacherEmail}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 uppercase font-mono mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(request.submissionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant="secondary" className="w-fit text-[11px]">
                        {request.qualifications?.degree || "N/A"}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        {request.qualifications?.specialization}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono font-bold text-primary">
                      {request.qualifications?.experience || 0}
                      <span className="text-[10px] text-muted-foreground font-normal">Years</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request._id)}
                        disabled={approving[request._id]}
                        className="bg-primary hover:bg-primary/80 h-8"
                      >
                        {approving[request._id] ? <Loader className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectClick(request)}
                        disabled={approving[request._id]}
                        className="h-8"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Rejection Dialog - Match Dark Theme */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Why are you rejecting {selectedRequest?.teacherName}?
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason (e.g., Incomplete documentation)"
            className="w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none h-28"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={approving[selectedRequest?._id]}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingApprovalsAdmin;