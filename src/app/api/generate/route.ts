import { NextRequest, NextResponse } from "next/server";
import {
  analyzeMusicTheory,
  orchestrateInstruments,
  generateMelodyHarmony,
} from "@/lib/kestra";
import type { Project, Track } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Simulate Kestra workflow with 3 agents
    const progressCallbacks: Array<{
      agent: "analyzer" | "orchestrator" | "generator";
      onProgress?: (progress: any) => void;
    }> = [];

    // Agent 1: Music Theory Analyzer
    const analysis = await analyzeMusicTheory(description);
    const { key, tempo, timeSignature, chordProgression } = analysis;

    // Agent 2: Instrument Orchestrator
    const orchestration = await orchestrateInstruments(
      description,
      chordProgression
    );

    // Agent 3: Melody & Harmony Generator
    const tracks = await generateMelodyHarmony(
      orchestration.instruments,
      chordProgression,
      key
    );

    // Create project
    const project: Project = {
      id: `project-${Date.now()}`,
      name: `Generated: ${description.substring(0, 30)}...`,
      tempo,
      key,
      timeSignature,
      tracks,
      createdAt: new Date(),
    };

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error generating music:", error);
    return NextResponse.json(
      { error: "Failed to generate music" },
      { status: 500 }
    );
  }
}

