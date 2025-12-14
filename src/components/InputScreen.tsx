"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Loader2, Upload, Mic } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import type { KestraAgentProgress } from "@/lib/types";

export default function InputScreen() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<KestraAgentProgress[]>([]);
  const router = useRouter();
  const { setProject } = useProjectStore();

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setProgress([
      { agent: "analyzer", status: "pending", progress: 0 },
      { agent: "orchestrator", status: "pending", progress: 0 },
      { agent: "generator", status: "pending", progress: 0 },
    ]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      
      // Set project in store
      if (data.project) {
        setProject(data.project);
      }
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error generating music:", error);
      alert("Failed to generate music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentName = (agent: string) => {
    switch (agent) {
      case "analyzer":
        return "Music Theory Analyzer";
      case "orchestrator":
        return "Instrument Orchestrator";
      case "generator":
        return "Melody & Harmony Generator";
      default:
        return agent;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "running":
        return "text-blue-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Music className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Create Your Music
          </h1>
          <p className="text-muted-foreground text-lg">
            Describe the music you want to create, and AI will generate it for you
          </p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Describe your music
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 'chill lofi hip-hop beat', 'epic orchestral battle theme', 'upbeat jazz piano with melancholy undertones'"
                className="w-full min-h-[120px] p-4 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={isLoading}
                onClick={() => {
                  // File upload handler (placeholder)
                  alert("File upload coming soon");
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Reference
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={isLoading}
                onClick={() => {
                  // Audio recording handler (placeholder)
                  alert("Audio recording coming soon");
                }}
              >
                <Mic className="h-4 w-4 mr-2" />
                Hum Melody
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !description.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Music"
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && progress.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Generation Progress</h3>
              <div className="space-y-3">
                {progress.map((p, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {getAgentName(p.agent)}
                      </span>
                      <span className={`text-sm ${getStatusColor(p.status)}`}>
                        {p.status === "completed" && "✓"}
                        {p.status === "running" && "⟳"}
                        {p.status === "pending" && "○"}
                        {p.status === "error" && "✗"}
                      </span>
                    </div>
                    {p.status === "running" && (
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    )}
                    {p.message && (
                      <p className="text-xs text-muted-foreground">{p.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

