import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Building2,
  Rocket,
  BookOpen,
  DollarSign,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <ProtectedRoute requireAdmin>
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
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage the Tech Atlas platform and view analytics
            </p>
          </motion.div>

          {/* Admin Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-['Space_Grotesk']">Admin Panel</CardTitle>
              <CardDescription>
                Platform management and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 lg:grid-cols-3 mb-6">
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics">
                  <AnalyticsDashboard />
                </TabsContent>

                <TabsContent value="content">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Content moderation features coming soon
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Management</h3>
                    <p className="text-muted-foreground mb-4">
                      User management features coming soon
                    </p>
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
