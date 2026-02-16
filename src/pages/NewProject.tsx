import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function NewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    built_up_area: "",
    floors: "1",
    budget: "",
    timeline_weeks: "12",
    wage_rate: "500",
    cost_per_sq_yard: "1500",
  });

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { data, error } = await supabase.from("projects").insert({
      user_id: user.id,
      name: form.name,
      description: form.description,
      built_up_area: Number(form.built_up_area),
      floors: Number(form.floors),
      budget: Number(form.budget),
      timeline_weeks: Number(form.timeline_weeks),
      wage_rate: Number(form.wage_rate),
      cost_per_sq_yard: Number(form.cost_per_sq_yard),
    }).select("id").single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      toast({ title: "Project created!" });
      navigate(`/projects/${data.id}`);
    }
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-xl">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="My G+3 Residential Building" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief description of the project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Built-up Area (sq. yards)</Label>
                  <Input type="number" value={form.built_up_area} onChange={(e) => update("built_up_area", e.target.value)} required min={1} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Floors</Label>
                  <Input type="number" value={form.floors} onChange={(e) => update("floors", e.target.value)} required min={1} max={100} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget (₹)</Label>
                  <Input type="number" value={form.budget} onChange={(e) => update("budget", e.target.value)} required min={0} />
                </div>
                <div className="space-y-2">
                  <Label>Timeline (weeks)</Label>
                  <Input type="number" value={form.timeline_weeks} onChange={(e) => update("timeline_weeks", e.target.value)} required min={1} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Wage Rate (₹/day)</Label>
                  <Input type="number" value={form.wage_rate} onChange={(e) => update("wage_rate", e.target.value)} min={0} />
                </div>
                <div className="space-y-2">
                  <Label>Cost per Sq. Yard (₹)</Label>
                  <Input type="number" value={form.cost_per_sq_yard} onChange={(e) => update("cost_per_sq_yard", e.target.value)} min={0} />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-amber text-primary-foreground shadow-amber" disabled={submitting}>
                {submitting ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
