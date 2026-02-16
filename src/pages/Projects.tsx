import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProjectRow {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  floors: number;
  built_up_area: number;
  timeline_weeks: number;
  created_at: string;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data as ProjectRow[]) || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your construction projects</p>
          </div>
          <Button onClick={() => navigate("/projects/new")} className="gradient-amber text-primary-foreground shadow-amber">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
              <h3 className="font-mono font-semibold text-lg mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-sm mb-6">Create your first construction project to get started</p>
              <Button onClick={() => navigate("/projects/new")} className="gradient-amber text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border border-border"
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono capitalize ${
                        p.status === "in_progress" ? "bg-accent/10 text-accent" :
                        p.status === "completed" ? "bg-green-100 text-green-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="font-mono font-semibold mb-1">{p.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description || "No description"}</p>
                    <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Floors</p>
                        <p className="font-mono font-semibold text-sm">{p.floors}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Area</p>
                        <p className="font-mono font-semibold text-sm">{p.built_up_area}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-mono font-semibold text-sm">₹{(Number(p.budget) / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
