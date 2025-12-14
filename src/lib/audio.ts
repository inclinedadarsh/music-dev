import * as Tone from "tone";
import type { Track, Project } from "./types";

let transport: Tone.Transport | null = null;
let synths: Map<string, Tone.PolySynth> = new Map();
let isInitialized = false;

export async function initializeAudio() {
  if (isInitialized) return;
  
  await Tone.start();
  transport = Tone.Transport;
  isInitialized = true;
}

export function getSynth(trackId: string): Tone.PolySynth {
  if (!synths.has(trackId)) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synths.set(trackId, synth);
  }
  return synths.get(trackId)!;
}

export function playTrack(track: Track) {
  if (!transport || !isInitialized) {
    console.warn("Audio not initialized");
    return;
  }

  const synth = getSynth(track.id);
  synth.volume.value = Tone.gainToDb(track.volume);
  
  if (track.muted) {
    synth.volume.value = -Infinity;
    return;
  }

  // Clear previous schedule
  transport.cancel(0);
  
  // Schedule notes
  track.notes.forEach((note) => {
    const time = parseTimeString(note.time);
    const duration = parseDuration(note.duration);
    const frequency = noteToFrequency(note.pitch);
    
    synth.triggerAttackRelease(
      frequency,
      duration,
      time,
      note.velocity / 127
    );
  });
}

export function playAll(project: Project) {
  if (!transport || !isInitialized) {
    console.warn("Audio not initialized");
    return;
  }

  transport.stop();
  transport.cancel(0);
  
  project.tracks.forEach((track) => {
    const synth = getSynth(track.id);
    synth.volume.value = Tone.gainToDb(track.volume);
    
    if (track.muted) {
      synth.volume.value = -Infinity;
      return;
    }

    track.notes.forEach((note) => {
      const time = parseTimeString(note.time);
      const duration = parseDuration(note.duration);
      const frequency = noteToFrequency(note.pitch);
      
      synth.triggerAttackRelease(
        frequency,
        duration,
        time,
        note.velocity / 127
      );
    });
  });

  transport.start();
}

export function stopAll() {
  if (!transport) return;
  transport.stop();
  transport.cancel(0);
  
  // Stop all synths
  synths.forEach((synth) => {
    synth.releaseAll();
  });
}

export function pauseAll() {
  if (!transport) return;
  transport.pause();
}

export function updateTempo(tempo: number) {
  if (!transport) return;
  transport.bpm.value = tempo;
}

function noteToFrequency(note: string): number {
  // Convert note like "C4" to frequency
  const noteMap: Record<string, number> = {
    C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5,
    "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
  };
  
  const match = note.match(/([A-G]#?)(\d+)/);
  if (!match) return 440; // Default to A4
  
  const [, noteName, octave] = match;
  const semitone = noteMap[noteName] + (parseInt(octave) - 4) * 12;
  return 440 * Math.pow(2, semitone / 12);
}

function parseTimeString(time: string): number {
  // Parse "bar:quarter:sixteenth" format
  const [bar, quarter, sixteenth] = time.split(":").map(Number);
  const beatsPerBar = 4; // Assuming 4/4 time
  return (bar - 1) * beatsPerBar + quarter * 0.25 + sixteenth * 0.0625;
}

function parseDuration(duration: string): string {
  // Convert duration strings like "4n" to Tone.js format
  return duration;
}

export function cleanup() {
  stopAll();
  synths.forEach((synth) => synth.dispose());
  synths.clear();
}

