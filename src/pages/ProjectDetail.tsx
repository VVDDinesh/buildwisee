import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Brain, Box, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  built_up_area: number;
  floors: number;
  budget: number;
  timeline_weeks: number;
  wage_rate: number;
  cost_per_sq_yard: number;
  status: string;
  ai_analysis: any;
  blueprint_data: any;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/projects");
          return;
        }
        setProject(data as Project);
        setLoading(false);
      });
  }, [id, user]);

  const runAnalysis = async () => {
    if (!project) return;
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-planner", {
        body: {
          built_up_area: project.built_up_area,
          floors: project.floors,
          timeline_weeks: project.timeline_weeks,
          wage_rate: project.wage_rate,
          cost_per_sq_yard: project.cost_per_sq_yard,
          budget: project.budget,
        },
      });
      if (error) throw error;
      
      await supabase.from("projects").update({ ai_analysis: data.analysis }).eq("id", project.id);
      setProject((p) => p ? { ...p, ai_analysis: data.analysis } : p);
      toast({ title: "Analysis complete!" });
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    }
    setAnalyzing(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  if (!project) return null;

  const analysis = project.ai_analysis;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <button onClick={() => navigate("/projects")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-mono text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description || "No description"}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-mono capitalize ${
              project.status === "in_progress" ? "bg-accent/10 text-accent" :
              project.status === "completed" ? "bg-green-100 text-green-700" :
              "bg-muted text-muted-foreground"
            }`}>
              {project.status.replace("_", " ")}
            </span>
          </div>

          {/* Project specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Area", value: `${project.built_up_area} sq.yd` },
              { label: "Floors", value: project.floors },
              { label: "Budget", value: `₹${(Number(project.budget) / 100000).toFixed(1)}L` },
              { label: "Timeline", value: `${project.timeline_weeks} weeks` },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-mono font-bold text-lg">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button onClick={runAnalysis} disabled={analyzing} className="gradient-amber text-primary-foreground shadow-amber">
              {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : <><Brain className="h-4 w-4 mr-2" /> AI Analysis</>}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/viewer?project=${project.id}`)}>
              <Box className="h-4 w-4 mr-2" /> 3D View
            </Button>
          </div>

          {/* AI Analysis Results */}
          {analysis && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-mono text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" /> AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {typeof analysis === "string" ? (
                    <p className="whitespace-pre-wrap text-sm">{analysis}</p>
                  ) : (
                    <pre className="bg-muted rounded-lg p-4 text-xs overflow-auto">{JSON.stringify(analysis, null, 2)}</pre>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
