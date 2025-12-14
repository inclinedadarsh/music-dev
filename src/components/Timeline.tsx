"use client";

import { useProjectStore } from "@/lib/store";
import type { Note } from "@/lib/types";

export default function Timeline() {
  const { project } = useProjectStore();

  if (!project) return null;

  const bars = 8;
  const beatsPerBar = 4;

  const parseTime = (time: string): { bar: number; beat: number } => {
    const [bar, beat] = time.split(":").map(Number);
    return { bar: bar - 1, beat };
  };

  const getNotePosition = (note: Note, barWidth: number): {
    left: number;
    width: number;
  } => {
    const { bar, beat } = parseTime(note.time);
    const beatWidth = barWidth / beatsPerBar;
    const left = bar * barWidth + beat * beatWidth;
    
    // Parse duration (simplified - assumes quarter notes)
    const duration = 1; // 1 beat for "4n"
    const width = duration * beatWidth;
    
    return { left, width };
  };

  const barWidth = 120;

  return (
    <div className="p-6 bg-card border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Timeline</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Bar markers */}
          <div className="flex mb-2">
            {Array.from({ length: bars }).map((_, index) => (
              <div
                key={index}
                className="flex-1 border-l border-border text-xs text-muted-foreground px-2"
                style={{ minWidth: `${barWidth}px` }}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Track rows */}
          <div className="space-y-2">
            {project.tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-4">
                <div className="w-32 flex items-center gap-2">
                  <span className="text-lg">
                    {track.instrument === "piano" && "🎹"}
                    {track.instrument === "guitar" && "🎸"}
                    {track.instrument === "drums" && "🥁"}
                    {track.instrument === "bass" && "🎸"}
                    {track.instrument === "strings" && "🎻"}
                    {track.instrument === "synth" && "🎚️"}
                    {track.instrument === "brass" && "🎺"}
                    {track.instrument === "woodwinds" && "🎷"}
                  </span>
                  <span className="text-sm text-foreground truncate">
                    {track.name}
                  </span>
                </div>
                <div
                  className="relative flex-1 h-8 border border-border rounded"
                  style={{ minWidth: `${bars * barWidth}px` }}
                >
                  {track.notes.map((note, noteIndex) => {
                    const { left, width } = getNotePosition(note, barWidth);
                    return (
                      <div
                        key={noteIndex}
                        className="absolute h-full rounded bg-primary/60 hover:bg-primary transition-colors"
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          backgroundColor: track.color + "80",
                        }}
                        title={`${note.pitch} at ${note.time}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

