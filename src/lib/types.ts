export type Instrument =
  | "piano"
  | "guitar"
  | "drums"
  | "bass"
  | "strings"
  | "synth"
  | "brass"
  | "woodwinds";

export type Column = "melody" | "harmony" | "rhythm" | "bass";

export interface Note {
  pitch: string; // e.g., "C4", "E4"
  duration: string; // e.g., "4n" (quarter note)
  time: string; // e.g., "0:0:0" (bar:quarter:sixteenth)
  velocity: number; // 0-127
}

export interface Track {
  id: string;
  name: string;
  instrument: Instrument;
  column: Column;
  notes: Note[];
  volume: number; // 0-1
  muted: boolean;
  color: string; // for visual distinction
}

export interface Project {
  id: string;
  name: string;
  tempo: number;
  key: string;
  timeSignature: string;
  tracks: Track[];
  createdAt: Date;
}

export interface KestraAgentProgress {
  agent: "analyzer" | "orchestrator" | "generator";
  status: "pending" | "running" | "completed" | "error";
  progress: number; // 0-100
  message?: string;
}

