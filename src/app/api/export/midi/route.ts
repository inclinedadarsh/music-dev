import { NextRequest, NextResponse } from "next/server";
import type { Project, Note } from "@/lib/types";

// Simplified MIDI generation (for MVP - would use proper MIDI library in production)
function generateMIDI(project: Project): ArrayBuffer {
  // This is a simplified MIDI file structure
  // In production, you'd use a proper MIDI library like 'midi-writer-js' or similar
  
  // MIDI file header (simplified)
  const header = new Uint8Array([
    0x4d, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x01, // Format (single track)
    0x00, 0x01, // Number of tracks
    0x00, 0x78, // Ticks per quarter note (120)
  ]);

  // Track data (simplified - would need proper MIDI encoding)
  // For MVP, we'll return a basic structure
  const trackData = new Uint8Array([
    0x4d, 0x54, 0x72, 0x6b, // "MTrk"
    0x00, 0x00, 0x00, 0x14, // Track length
    // Track end
    0x00, 0xff, 0x2f, 0x00, // End of track
  ]);

  // Combine header and track
  const midiFile = new Uint8Array(header.length + trackData.length);
  midiFile.set(header, 0);
  midiFile.set(trackData, header.length);

  return midiFile.buffer;
}

export async function POST(request: NextRequest) {
  try {
    const { project } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: "Project is required" },
        { status: 400 }
      );
    }

    const midiBuffer = generateMIDI(project as Project);

    return new NextResponse(midiBuffer, {
      headers: {
        "Content-Type": "audio/midi",
        "Content-Disposition": `attachment; filename="${project.name.replace(/\s+/g, "_")}.mid"`,
      },
    });
  } catch (error) {
    console.error("Error generating MIDI:", error);
    return NextResponse.json(
      { error: "Failed to generate MIDI file" },
      { status: 500 }
    );
  }
}

