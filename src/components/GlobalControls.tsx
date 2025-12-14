"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Square, Download, Code } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { playAll, stopAll, pauseAll, updateTempo } from "@/lib/audio";

const keys = [
  "C Major",
  "G Major",
  "D Major",
  "A Major",
  "E Major",
  "B Major",
  "F# Major",
  "C# Major",
  "F Major",
  "Bb Major",
  "Eb Major",
  "Ab Major",
  "Db Major",
  "Gb Major",
  "A Minor",
  "E Minor",
  "B Minor",
  "F# Minor",
  "C# Minor",
  "G# Minor",
  "D# Minor",
  "A# Minor",
  "D Minor",
  "G Minor",
  "C Minor",
  "F Minor",
  "Bb Minor",
  "Eb Minor",
  "Ab Minor",
];

export default function GlobalControls() {
  const { project, updateTempo: updateTempoStore, updateKey } = useProjectStore();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!project) return null;

  const handlePlayAll = () => {
    if (isPlaying) {
      pauseAll();
      setIsPlaying(false);
    } else {
      playAll(project);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    stopAll();
    setIsPlaying(false);
  };

  const handleTempoChange = (value: number[]) => {
    const newTempo = value[0];
    updateTempoStore(newTempo);
    updateTempo(newTempo);
  };

  const handleKeyChange = (key: string) => {
    updateKey(key);
  };

  const handleGeneratePython = async () => {
    try {
      const response = await fetch("/api/export/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (!response.ok) throw new Error("Export failed");

      const data = await response.json();
      
      // Download the file
      const blob = new Blob([data.code], { type: "text/x-python" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename || `${project.name}.py`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Python code:", error);
      alert("Failed to export Python code");
    }
  };

  const handleExportMIDI = async () => {
    try {
      const response = await fetch("/api/export/midi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name}.mid`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting MIDI:", error);
      alert("Failed to export MIDI");
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlayAll}
          disabled={project.tracks.length === 0}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Play All
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          disabled={!isPlaying}
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </Button>
      </div>

      {/* Tempo Slider */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Tempo:
        </span>
        <Slider
          value={[project.tempo]}
          onValueChange={handleTempoChange}
          min={60}
          max={180}
          step={1}
          className="flex-1"
        />
        <span className="text-sm font-medium text-foreground w-12">
          {project.tempo} BPM
        </span>
      </div>

      {/* Key Selector */}
      <Select value={project.key} onValueChange={handleKeyChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select key" />
        </SelectTrigger>
        <SelectContent>
          {keys.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Export Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90"
          onClick={handleGeneratePython}
        >
          <Code className="h-4 w-4 mr-1" />
          Generate Python Code
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportMIDI}>
          <Download className="h-4 w-4 mr-1" />
          Export MIDI
        </Button>
      </div>
    </div>
  );
}

