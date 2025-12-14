import type { Track, Note, KestraAgentProgress } from "./types";

// Simulated Kestra Agent 1: Music Theory Analyzer
export async function analyzeMusicTheory(
  description: string,
  onProgress?: (progress: KestraAgentProgress) => void
): Promise<{
  key: string;
  tempo: number;
  timeSignature: string;
  chordProgression: string[];
}> {
  onProgress?.({
    agent: "analyzer",
    status: "running",
    progress: 0,
    message: "Analyzing music theory...",
  });

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  onProgress?.({
    agent: "analyzer",
    status: "running",
    progress: 50,
    message: "Determining key and tempo...",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple keyword-based analysis
  const lowerDesc = description.toLowerCase();
  let key = "C Major";
  let tempo = 120;
  let timeSignature = "4/4";
  let chordProgression: string[] = [];

  if (lowerDesc.includes("jazz") || lowerDesc.includes("swing")) {
    key = "Bb Major";
    tempo = 140;
    chordProgression = ["I", "vi", "ii", "V"];
  } else if (lowerDesc.includes("lofi") || lowerDesc.includes("chill")) {
    key = "C Major";
    tempo = 90;
    chordProgression = ["I", "vi", "IV", "V"];
  } else if (lowerDesc.includes("epic") || lowerDesc.includes("orchestral")) {
    key = "D Minor";
    tempo = 100;
    chordProgression = ["i", "VI", "III", "VII"];
  } else if (lowerDesc.includes("upbeat") || lowerDesc.includes("happy")) {
    key = "G Major";
    tempo = 130;
    chordProgression = ["I", "V", "vi", "IV"];
  } else if (lowerDesc.includes("sad") || lowerDesc.includes("melancholy")) {
    key = "A Minor";
    tempo = 80;
    chordProgression = ["i", "VI", "III", "VII"];
  }

  onProgress?.({
    agent: "analyzer",
    status: "completed",
    progress: 100,
    message: "Analysis complete",
  });

  return { key, tempo, timeSignature, chordProgression };
}

// Simulated Kestra Agent 2: Instrument Orchestrator
export async function orchestrateInstruments(
  description: string,
  chordProgression: string[],
  onProgress?: (progress: KestraAgentProgress) => void
): Promise<{
  instruments: Array<{
    type: Track["instrument"];
    column: Track["column"];
    noteRange: { min: string; max: string };
  }>;
}> {
  onProgress?.({
    agent: "orchestrator",
    status: "running",
    progress: 0,
    message: "Selecting instruments...",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerDesc = description.toLowerCase();
  const instruments: Array<{
    type: Track["instrument"];
    column: Track["column"];
    noteRange: { min: string; max: string };
  }> = [];

  // Always add a melody instrument
  if (lowerDesc.includes("piano")) {
    instruments.push({
      type: "piano",
      column: "melody",
      noteRange: { min: "C3", max: "C6" },
    });
  } else if (lowerDesc.includes("guitar")) {
    instruments.push({
      type: "guitar",
      column: "melody",
      noteRange: { min: "E3", max: "E5" },
    });
  } else {
    instruments.push({
      type: "piano",
      column: "melody",
      noteRange: { min: "C4", max: "C6" },
    });
  }

  // Add harmony
  instruments.push({
    type: "strings",
    column: "harmony",
    noteRange: { min: "C3", max: "C5" },
  });

  // Add rhythm
  if (lowerDesc.includes("drums") || lowerDesc.includes("beat")) {
    instruments.push({
      type: "drums",
      column: "rhythm",
      noteRange: { min: "C2", max: "C4" },
    });
  }

  // Add bass
  instruments.push({
    type: "bass",
    column: "bass",
    noteRange: { min: "C2", max: "C4" },
  });

  onProgress?.({
    agent: "orchestrator",
    status: "completed",
    progress: 100,
    message: "Orchestration complete",
  });

  return { instruments };
}

// Simulated Kestra Agent 3: Melody & Harmony Generator
export async function generateMelodyHarmony(
  instruments: Array<{
    type: Track["instrument"];
    column: Track["column"];
    noteRange: { min: string; max: string };
  }>,
  chordProgression: string[],
  key: string,
  onProgress?: (progress: KestraAgentProgress) => void
): Promise<Track[]> {
  onProgress?.({
    agent: "generator",
    status: "running",
    progress: 0,
    message: "Generating melodies...",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const tracks: Track[] = [];
  const colors = ["#6B9BD1", "#D16B6B", "#6BD1A3", "#D1B66B", "#B66BD1"];

  instruments.forEach((instrument, index) => {
    const notes: Note[] = [];
    const noteRange = getNoteRange(instrument.noteRange.min, instrument.noteRange.max);
    
    // Generate notes for 4 bars
    for (let bar = 0; bar < 4; bar++) {
      const chord = chordProgression[bar % chordProgression.length];
      const chordNotes = getChordNotes(chord, key, noteRange);
      
      chordNotes.forEach((note, noteIndex) => {
        notes.push({
          pitch: note,
          duration: "4n",
          time: `${bar + 1}:${noteIndex}:0`,
          velocity: 80,
        });
      });
    }

    tracks.push({
      id: `track-${Date.now()}-${index}`,
      name: `${instrument.type.charAt(0).toUpperCase() + instrument.type.slice(1)} ${instrument.column}`,
      instrument: instrument.type,
      column: instrument.column,
      notes,
      volume: 0.8,
      muted: false,
      color: colors[index % colors.length],
    });
  });

  onProgress?.({
    agent: "generator",
    status: "completed",
    progress: 100,
    message: "Generation complete",
  });

  return tracks;
}

function getNoteRange(min: string, max: string): string[] {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const minMatch = min.match(/([A-G]#?)(\d+)/);
  const maxMatch = max.match(/([A-G]#?)(\d+)/);
  
  if (!minMatch || !maxMatch) return ["C4", "E4", "G4"];
  
  const [, minNote, minOctave] = minMatch;
  const [, maxNote, maxOctave] = maxMatch;
  
  const range: string[] = [];
  const minOct = parseInt(minOctave);
  const maxOct = parseInt(maxOctave);
  
  for (let oct = minOct; oct <= maxOct; oct++) {
    const startIdx = oct === minOct ? notes.indexOf(minNote) : 0;
    const endIdx = oct === maxOct ? notes.indexOf(maxNote) : notes.length - 1;
    
    for (let i = startIdx; i <= endIdx; i++) {
      range.push(`${notes[i]}${oct}`);
    }
  }
  
  return range;
}

function getChordNotes(chord: string, key: string, availableNotes: string[]): string[] {
  // Simplified chord generation
  const scale = getScale(key);
  const chordNotes: string[] = [];
  
  if (chord === "I" || chord === "i") {
    chordNotes.push(scale[0], scale[2], scale[4]);
  } else if (chord === "ii" || chord === "II") {
    chordNotes.push(scale[1], scale[3], scale[5]);
  } else if (chord === "iii" || chord === "III") {
    chordNotes.push(scale[2], scale[4], scale[6]);
  } else if (chord === "IV" || chord === "iv") {
    chordNotes.push(scale[3], scale[5], scale[0]);
  } else if (chord === "V" || chord === "v") {
    chordNotes.push(scale[4], scale[6], scale[1]);
  } else if (chord === "vi" || chord === "VI") {
    chordNotes.push(scale[5], scale[0], scale[2]);
  } else if (chord === "VII" || chord === "vii") {
    chordNotes.push(scale[6], scale[1], scale[3]);
  }
  
  // Filter to available note range
  return chordNotes.filter((note) => 
    availableNotes.some((n) => n.startsWith(note.replace(/\d+$/, "")))
  ).slice(0, 3);
}

function getScale(key: string): string[] {
  const major = ["C", "D", "E", "F", "G", "A", "B"];
  const minor = ["A", "B", "C", "D", "E", "F", "G"];
  
  if (key.toLowerCase().includes("minor")) {
    return minor;
  }
  return major;
}

