import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Brain, Box, Bot, ArrowRight, HardHat } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "AI Cost Analysis", desc: "Get instant worker, material, and cost estimates powered by AI." },
  { icon: Box, title: "3D Blueprints", desc: "Animated construction phase visualization with interactive controls." },
  { icon: Bot, title: "Smart Chatbot", desc: "Ask anything about your project — costs, schedules, materials." },
  { icon: HardHat, title: "Role-Based Access", desc: "Contractors, developers, and project managers each get tailored views." },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="gradient-amber rounded-lg p-2">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-mono text-xl font-bold">BuildWise</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button onClick={() => navigate("/auth")} className="gradient-amber text-primary-foreground shadow-amber">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 py-24 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-mono mb-6">
            <Brain className="h-4 w-4" /> AI-Powered Construction Planning
          </div>
          <h1 className="font-mono text-5xl md:text-6xl font-bold leading-tight mb-6">
            Build Smarter with{" "}
            <span className="text-gradient-amber">BuildWise</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Generative AI meets construction planning. Get instant cost breakdowns, dynamic 3D blueprints, intelligent scheduling, and expert AI guidance — all in one platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => navigate("/auth")} size="lg" className="gradient-amber text-primary-foreground shadow-amber text-base px-8">
              Start Planning <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => navigate("/auth")} size="lg" variant="outline" className="text-base px-8">
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-mono text-3xl font-bold mb-3">Everything you need to plan smart</h2>
          <p className="text-muted-foreground">From cost estimates to 3D visualization — powered by AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group rounded-xl border border-border bg-card p-8 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-mono text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 BuildWise. AI-Powered Construction Planning Platform.</p>
      </footer>
    </div>
  );
}
