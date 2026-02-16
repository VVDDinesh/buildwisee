import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  budget: number;
  floors: number;
  built_up_area: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("id, name, status, budget, floors, built_up_area, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data as ProjectRow[]) || []);
        setLoading(false);
      });
  }, [user]);

  const totalBudget = projects.reduce((s, p) => s + Number(p.budget), 0);
  const activeCount = projects.filter((p) => p.status === "in_progress").length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-primary" },
    { label: "Active", value: activeCount, icon: TrendingUp, color: "text-accent" },
    { label: "Total Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-primary" },
    { label: "Avg Timeline", value: projects.length ? `${Math.round(projects.reduce((s, p) => s + 12, 0) / projects.length)}w` : "—", icon: Calendar, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-mono text-3xl font-bold">Welcome, {profile?.full_name || "Builder"}</h1>
          <p className="text-muted-foreground mt-1">Your construction planning overview</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-mono font-bold mt-1">{s.value}</p>
                    </div>
                    <s.icon className={`h-8 w-8 ${s.color} opacity-70`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground">No projects yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.floors} floors · {p.built_up_area} sq.yd</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-mono capitalize ${
                      p.status === "in_progress" ? "bg-accent/10 text-accent" :
                      p.status === "completed" ? "bg-green-100 text-green-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
