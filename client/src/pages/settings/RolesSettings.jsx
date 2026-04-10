import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

const ALL_PERMISSIONS = [
  "view_class",
  "create_class",
  "take_attendance",
  "create_assignment",
  "generate_exam",
  "upload_material",
  "view_dashboard",
];

// 'export default' lakhvu khub jaruri che
export default function RolesSettings() {
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get("/roles");
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleToggle = (roleId, perm) => {
    setEditing((prev) => {
      let current = prev[roleId] ?? roles.find((r) => r._id === roleId)?.permissions ?? [];
      if (current.includes("*")) current = [...ALL_PERMISSIONS];

      return {
        ...prev,
        [roleId]: current.includes(perm)
          ? current.filter((p) => p !== perm)
          : [...current, perm],
      };
    });
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      for (const roleId in editing) {
        let updatedPerms = editing[roleId];
        if (updatedPerms.length === ALL_PERMISSIONS.length) updatedPerms = ["*"];
        await api.put(`/roles/${roleId}`, { permissions: updatedPerms });
      }
      window.location.reload();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (role, perm) => {
    const current = editing[role._id] ?? role.permissions ?? [];
    return current.includes("*") || current.includes(perm);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={handleSaveAll} disabled={loading || Object.keys(editing).length === 0}>
          {loading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Permission Name</TableHead>
                {roles.map((role) => (
                  <TableHead key={role._id} className="text-center capitalize font-bold">
                    {role.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALL_PERMISSIONS.map((perm) => (
                <TableRow key={perm} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium capitalize py-4">
                    {perm.replace(/_/g, " ")}
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role._id} className="text-center">
                      <Switch
                        checked={hasPermission(role, perm)}
                        onCheckedChange={() => handleToggle(role._id, perm)}
                        disabled={loading || role.name === "admin"} // Admin access master hoy
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}