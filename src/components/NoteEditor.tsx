"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store";
import type { Track, Note } from "@/lib/types";

interface NoteEditorProps {
  track: Track;
  onClose: () => void;
}

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const octaves = [2, 3, 4, 5, 6];
const bars = 8;
const beatsPerBar = 4;

export default function NoteEditor({ track, onClose }: NoteEditorProps) {
  const { updateTrack } = useProjectStore();
  const [editedNotes, setEditedNotes] = useState<Note[]>(track.notes);
  const [selectedCell, setSelectedCell] = useState<{
    bar: number;
    beat: number;
    note: string;
  } | null>(null);

  const toggleNote = (bar: number, beat: number, note: string) => {
    const time = `${bar + 1}:${beat}:0`;
    const existingNoteIndex = editedNotes.findIndex(
      (n) => n.time === time && n.pitch === note
    );

    if (existingNoteIndex >= 0) {
      // Remove note
      setEditedNotes(editedNotes.filter((_, i) => i !== existingNoteIndex));
    } else {
      // Add note
      setEditedNotes([
        ...editedNotes,
        {
          pitch: note,
          duration: "4n",
          time,
          velocity: 80,
        },
      ]);
    }
  };

  const hasNote = (bar: number, beat: number, note: string): boolean => {
    const time = `${bar + 1}:${beat}:0`;
    return editedNotes.some((n) => n.time === time && n.pitch === note);
  };

  const handleSave = () => {
    updateTrack(track.id, { notes: editedNotes });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Notes: {track.name}</DialogTitle>
          <DialogDescription>
            Click on the grid to add or remove notes
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header */}
              <div className="flex border-b border-border">
                <div className="w-24 p-2 text-xs font-medium text-muted-foreground">
                  Note/Bar
                </div>
                {Array.from({ length: bars }).map((_, barIndex) => (
                  <div
                    key={barIndex}
                    className="flex-1 border-l border-border p-2 text-xs font-medium text-center text-muted-foreground"
                  >
                    Bar {barIndex + 1}
                  </div>
                ))}
              </div>

              {/* Piano Roll Grid */}
              <div className="border border-border">
                {octaves.map((octave) =>
                  notes
                    .slice()
                    .reverse()
                    .map((note) => {
                      const fullNote = `${note}${octave}`;
                      return (
                        <div
                          key={fullNote}
                          className="flex border-b border-border hover:bg-muted/50"
                        >
                          <div className="w-24 p-2 text-xs font-mono text-foreground border-r border-border">
                            {fullNote}
                          </div>
                          {Array.from({ length: bars }).map((_, barIndex) => (
                            <div
                              key={barIndex}
                              className="flex-1 border-l border-border"
                            >
                              {Array.from({ length: beatsPerBar }).map(
                                (_, beatIndex) => (
                                  <button
                                    key={beatIndex}
                                    onClick={() =>
                                      toggleNote(barIndex, beatIndex, fullNote)
                                    }
                                    className={`w-full h-8 border-r border-b border-border hover:bg-primary/20 transition-colors ${
                                      hasNote(barIndex, beatIndex, fullNote)
                                        ? "bg-primary"
                                        : ""
                                    }`}
                                  />
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

