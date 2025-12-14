import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, Track, Column } from "./types";

interface ProjectStore {
  project: Project | null;
  setProject: (project: Project) => void;
  updateProjectName: (name: string) => void;
  updateTempo: (tempo: number) => void;
  updateKey: (key: string) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  moveTrack: (trackId: string, newColumn: Column) => void;
  updateTrackVolume: (trackId: string, volume: number) => void;
  toggleTrackMute: (trackId: string) => void;
  reset: () => void;
}

const defaultProject: Project = {
  id: "1",
  name: "My Composition",
  tempo: 120,
  key: "C Major",
  timeSignature: "4/4",
  tracks: [],
  createdAt: new Date(),
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      project: null,
      setProject: (project) => set({ project }),
      updateProjectName: (name) =>
        set((state) => ({
          project: state.project ? { ...state.project, name } : null,
        })),
      updateTempo: (tempo) =>
        set((state) => ({
          project: state.project ? { ...state.project, tempo } : null,
        })),
      updateKey: (key) =>
        set((state) => ({
          project: state.project ? { ...state.project, key } : null,
        })),
      addTrack: (track) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: [...state.project.tracks, track],
              }
            : null,
        })),
      removeTrack: (trackId) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: state.project.tracks.filter((t) => t.id !== trackId),
              }
            : null,
        })),
      updateTrack: (trackId, updates) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: state.project.tracks.map((t) =>
                  t.id === trackId ? { ...t, ...updates } : t
                ),
              }
            : null,
        })),
      moveTrack: (trackId, newColumn) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: state.project.tracks.map((t) =>
                  t.id === trackId ? { ...t, column: newColumn } : t
                ),
              }
            : null,
        })),
      updateTrackVolume: (trackId, volume) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: state.project.tracks.map((t) =>
                  t.id === trackId ? { ...t, volume } : t
                ),
              }
            : null,
        })),
      toggleTrackMute: (trackId) =>
        set((state) => ({
          project: state.project
            ? {
                ...state.project,
                tracks: state.project.tracks.map((t) =>
                  t.id === trackId ? { ...t, muted: !t.muted } : t
                ),
              }
            : null,
        })),
      reset: () => set({ project: null }),
    }),
    {
      name: "music-project-storage",
    }
  )
);

