import type { Project, Track, Note } from "./types";

export function generatePythonCode(project: Project): string {
  const code = `#!/usr/bin/env python3
"""
Generated Music Composition Script
Project: ${project.name}
Tempo: ${project.tempo} BPM
Key: ${project.key}
Time Signature: ${project.timeSignature}
"""

from midiutil import MIDIFile
from pydub import AudioSegment
from pydub.generators import Sine
import music21
from music21 import stream, note, chord, tempo, key, meter

# Create MIDI file
midi = MIDIFile(1)
track = 0
time = 0
midi.addTrackName(track, time, "${project.name}")
midi.addTempo(track, time, ${project.tempo})

# Create music21 stream for advanced operations
s = stream.Stream()
s.append(tempo.MetronomeMark(number=${project.tempo}))
s.append(key.KeySignature(${getKeySignature(project.key)}))
s.append(meter.TimeSignature("${project.timeSignature}"))

${generateTrackFunctions(project.tracks)}

def create_composition():
    """Main function to create the complete composition"""
    composition = stream.Stream()
    composition.append(tempo.MetronomeMark(number=${project.tempo}))
    composition.append(key.KeySignature(${getKeySignature(project.key)}))
    composition.append(meter.TimeSignature("${project.timeSignature}"))
    
${generateCompositionCode(project.tracks)}

    return composition

def export_midi(filename="${project.name.replace(/\s+/g, "_")}.mid"):
    """Export composition as MIDI file"""
    composition = create_composition()
    composition.write("midi", fp=filename)
    print(f"MIDI file exported: {filename}")

def export_wav(filename="${project.name.replace(/\s+/g, "_")}.wav"):
    """Export composition as WAV file"""
    composition = create_composition()
    # Convert to audio (requires additional setup)
    print(f"WAV export would be generated: {filename}")
    # Note: WAV export requires audio synthesis setup

if __name__ == "__main__":
    export_midi()
    print("\\nComposition generated successfully!")
    print(f"Project: ${project.name}")
    print(f"Tempo: ${project.tempo} BPM")
    print(f"Key: ${project.key}")
    print(f"Tracks: ${project.tracks.length}")
`;

  return code;
}

function generateTrackFunctions(tracks: Track[]): string {
  return tracks
    .map((track, index) => {
      const functionName = `track_${index + 1}_${track.instrument}`;
      return `
def ${functionName}():
    """Generate ${track.name} track"""
    track_stream = stream.Stream()
    ${generateNotesForTrack(track)}
    return track_stream
`;
    })
    .join("\n");
}

function generateNotesForTrack(track: Track): string {
  return track.notes
    .map((note) => {
      const time = parseTimeString(note.time);
      const duration = parseDuration(note.duration);
      return `    track_stream.append(note.Note("${note.pitch}", quarterLength=${duration}))`;
    })
    .join("\n");
}

function generateCompositionCode(tracks: Track[]): string {
  return tracks
    .map((track, index) => {
      const functionName = `track_${index + 1}_${track.instrument}`;
      return `    composition.append(${functionName}())`;
    })
    .join("\n");
}

function getKeySignature(key: string): string {
  const keyMap: Record<string, string> = {
    "C Major": "0",
    "G Major": "1",
    "D Major": "2",
    "A Major": "3",
    "E Major": "4",
    "B Major": "5",
    "F# Major": "6",
    "C# Major": "7",
    "F Major": "-1",
    "Bb Major": "-2",
    "Eb Major": "-3",
    "Ab Major": "-4",
    "Db Major": "-5",
    "Gb Major": "-6",
    "Cb Major": "-7",
    "A Minor": "0",
    "E Minor": "1",
    "B Minor": "2",
    "F# Minor": "3",
    "C# Minor": "4",
    "G# Minor": "5",
    "D# Minor": "6",
    "A# Minor": "7",
    "D Minor": "-1",
    "G Minor": "-2",
    "C Minor": "-3",
    "F Minor": "-4",
    "Bb Minor": "-5",
    "Eb Minor": "-6",
    "Ab Minor": "-7",
  };
  return keyMap[key] || "0";
}

function parseTimeString(time: string): number {
  const [bar, quarter, sixteenth] = time.split(":").map(Number);
  return (bar - 1) * 4 + quarter * 0.25 + sixteenth * 0.0625;
}

function parseDuration(duration: string): number {
  // Convert "4n" to quarterLength (1.0 for quarter note)
  const match = duration.match(/(\d+)n/);
  if (match) {
    return 4 / parseInt(match[1]);
  }
  return 1.0;
}

