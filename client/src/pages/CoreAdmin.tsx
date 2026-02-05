import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Shield, 
  Users, 
  Settings, 
  Database,
  Activity,
  UserCheck,
  UserX,
  Crown,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";

export default function CoreAdmin() {
  const [activeTab, setActiveTab] = useState("users");
  
  const { data: users, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery();
  const { data: roleHierarchy } = trpc.admin.getRoleHierarchy.useQuery();
  const { data: auditLog } = trpc.admin.getRoleAuditLog.useQuery();
  
  const assignRoleMutation = trpc.admin.assignRole.useMutation();
  const deactivateUserMutation = trpc.admin.deactivateUser.useMutation();

  const handleRoleChange = async (userId: number, newRole: string, reason?: string) => {
    try {
      await assignRoleMutation.mutateAsync({
        userId,
        newRole: newRole as any,
        reason,
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleDeactivateUser = async (userId: number, reason?: string) => {
    try {
      await deactivateUserMutation.mutateAsync({
        userId,
        reason,
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  return (
    <ProtectedRoute requireRole="core_admin">
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
                Core Admin
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Ultimate platform control and system management
            </p>
          </motion.div>

          {/* Core Admin Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-['Space_Grotesk'] flex items-center gap-2">
                <Shield className="h-6 w-6" />
                System Administration
              </CardTitle>
              <CardDescription>
                Manage users, roles, and platform security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Audit Log
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    System
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <Badge variant="outline">{users?.length || 0} Total Users</Badge>
                    </div>
                    
                    {usersLoading ? (
                      <div className="text-center py-8">Loading users...</div>
                    ) : (
                      <div className="space-y-3">
                        {users?.map((user) => (
                          <Card key={user.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium">{user.name || 'Unnamed User'}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <Badge variant={user.role === 'core_admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                {!user.isActive && (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value, 'Role updated by Core Admin')}
                                  className="px-3 py-1 border rounded"
                                  disabled={user.id === 1} // Prevent changing own role
                                >
                                  <option value="user">User</option>
                                  <option value="contributor">Contributor</option>
                                  <option value="moderator">Moderator</option>
                                  <option value="editor">Editor</option>
                                  <option value="admin">Admin</option>
                                  <option value="core_admin">Core Admin</option>
                                </select>
                                
                                {user.isActive && user.id !== 1 && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeactivateUser(user.id, 'Deactivated by Core Admin')}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="roles">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Role Hierarchy</h3>
                    <div className="space-y-3">
                      {roleHierarchy?.map((role) => (
                        <Card key={role.roleName} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{role.displayName}</p>
                              <p className="text-sm text-muted-foreground">Level {role.level}</p>
                            </div>
                            <Badge variant="outline">{role.roleName}</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="audit">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Role Change Audit Log</h3>
                    <div className="space-y-3">
                      {auditLog?.map((entry) => (
                        <Card key={entry.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                User {entry.userId}: {entry.previousRole} → {entry.newRole}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.reason || 'No reason provided'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">
                              By User {entry.assignedBy}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="system">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Database className="h-6 w-6 text-blue-500" />
                          <h3 className="text-lg font-semibold">Database</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Database management and maintenance
                        </p>
                        <Button variant="outline" className="w-full">
                          View Database Status
                        </Button>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          <h3 className="text-lg font-semibold">Security</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Security settings and monitoring
                        </p>
                        <Button variant="outline" className="w-full">
                          Security Dashboard
                        </Button>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}