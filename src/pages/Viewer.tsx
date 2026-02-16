import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import * as THREE from "three";

function Foundation({ progress }: { progress: number }) {
  const opacity = Math.min(progress / 0.15, 1);
  return (
    <mesh position={[0, 0.1, 0]} visible={opacity > 0}>
      <boxGeometry args={[8, 0.2, 6]} />
      <meshStandardMaterial color="#6b7280" transparent opacity={opacity} />
    </mesh>
  );
}

function Floor({ index, progress, totalFloors }: { index: number; progress: number; totalFloors: number }) {
  const floorStart = 0.15 + (index * 0.7) / totalFloors;
  const floorEnd = floorStart + 0.7 / totalFloors;
  const wallProgress = Math.max(0, Math.min((progress - floorStart) / (floorEnd - floorStart), 1));
  const y = 0.2 + index * 3.2;

  if (wallProgress <= 0) return null;

  return (
    <group position={[0, y, 0]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7.6, 0.15, 5.6]} />
        <meshStandardMaterial color="#9ca3af" transparent opacity={wallProgress} />
      </mesh>
      {/* Walls */}
      {[
        { pos: [-3.7, 1.5, 0] as [number, number, number], args: [0.2, 3, 5.6] as [number, number, number] },
        { pos: [3.7, 1.5, 0] as [number, number, number], args: [0.2, 3, 5.6] as [number, number, number] },
        { pos: [0, 1.5, -2.7] as [number, number, number], args: [7.6, 3, 0.2] as [number, number, number] },
        { pos: [0, 1.5, 2.7] as [number, number, number], args: [7.6, 3, 0.2] as [number, number, number] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos}>
          <boxGeometry args={w.args} />
          <meshStandardMaterial color="#d97706" transparent opacity={Math.max(0, wallProgress * 2 - 1)} />
        </mesh>
      ))}
    </group>
  );
}

function Roof({ progress, totalFloors }: { progress: number; totalFloors: number }) {
  const opacity = Math.max(0, (progress - 0.85) / 0.15);
  const y = 0.2 + totalFloors * 3.2;
  return (
    <mesh position={[0, y + 0.8, 0]} visible={opacity > 0}>
      <coneGeometry args={[5.5, 2, 4]} />
      <meshStandardMaterial color="#92400e" transparent opacity={opacity} />
    </mesh>
  );
}

function BuildingModel({ progress, floors }: { progress: number; floors: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Foundation progress={progress} />
      {Array.from({ length: floors }).map((_, i) => (
        <Floor key={i} index={i} progress={progress} totalFloors={floors} />
      ))}
      <Roof progress={progress} totalFloors={floors} />
    </group>
  );
}

export default function Viewer() {
  const [floors, setFloors] = useState(3);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            clearInterval(intervalRef.current);
            setPlaying(false);
            return 1;
          }
          return p + 0.005;
        });
      }, 30);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold">3D Blueprint Viewer</h1>
          <p className="text-muted-foreground mt-1">Animated construction phase visualization</p>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-full min-h-[500px] overflow-hidden border border-border">
              <Canvas>
                <PerspectiveCamera makeDefault position={[15, 12, 15]} />
                <OrbitControls enablePan enableZoom enableRotate />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
                <pointLight position={[-5, 8, -5]} intensity={0.3} />
                <Suspense fallback={null}>
                  <BuildingModel progress={progress} floors={floors} />
                </Suspense>
                <gridHelper args={[20, 20, "#444444", "#333333"]} />
              </Canvas>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <h3 className="font-mono font-semibold text-sm">Controls</h3>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Floors: {floors}</label>
                <Slider value={[floors]} onValueChange={([v]) => { setFloors(v); reset(); }} min={1} max={10} step={1} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Progress: {Math.round(progress * 100)}%</label>
                <Slider value={[progress * 100]} onValueChange={([v]) => setProgress(v / 100)} min={0} max={100} step={1} />
              </div>
              <div className="flex gap-2">
                <Button onClick={togglePlay} size="sm" variant="outline" className="flex-1">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={reset} size="sm" variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="font-mono font-semibold text-sm">Construction Phases</h3>
              {[
                { label: "Foundation", range: "0–15%", active: progress <= 0.15 && progress > 0 },
                { label: "Structure", range: "15–85%", active: progress > 0.15 && progress <= 0.85 },
                { label: "Roofing", range: "85–100%", active: progress > 0.85 },
              ].map((phase) => (
                <div key={phase.label} className={`flex items-center justify-between rounded-md px-3 py-2 text-xs ${
                  phase.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                }`}>
                  <span>{phase.label}</span>
                  <span className="font-mono">{phase.range}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
