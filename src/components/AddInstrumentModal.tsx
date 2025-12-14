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
import type { Column, Instrument } from "@/lib/types";

interface AddInstrumentModalProps {
  column: Column;
  onClose: () => void;
}

const instruments: Array<{
  type: Instrument;
  name: string;
  emoji: string;
}> = [
  { type: "piano", name: "Piano", emoji: "🎹" },
  { type: "guitar", name: "Guitar", emoji: "🎸" },
  { type: "drums", name: "Drums", emoji: "🥁" },
  { type: "bass", name: "Bass", emoji: "🎸" },
  { type: "strings", name: "Strings", emoji: "🎻" },
  { type: "synth", name: "Synth", emoji: "🎚️" },
  { type: "brass", name: "Brass", emoji: "🎺" },
  { type: "woodwinds", name: "Woodwinds", emoji: "🎷" },
];

const colors = ["#6B9BD1", "#D16B6B", "#6BD1A3", "#D1B66B", "#B66BD1"];

export default function AddInstrumentModal({
  column,
  onClose,
}: AddInstrumentModalProps) {
  const { addTrack } = useProjectStore();
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const handleAdd = () => {
    if (!selectedInstrument) return;

    const newTrack = {
      id: `track-${Date.now()}`,
      name: `${instruments.find((i) => i.type === selectedInstrument)?.name} ${column}`,
      instrument: selectedInstrument,
      column,
      notes: [],
      volume: 0.8,
      muted: false,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    addTrack(newTrack);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Instrument</DialogTitle>
          <DialogDescription>
            Select an instrument to add to the {column} column
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {instruments.map((instrument) => (
            <button
              key={instrument.type}
              onClick={() => setSelectedInstrument(instrument.type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedInstrument === instrument.type
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-4xl mb-2">{instrument.emoji}</div>
              <div className="text-sm font-medium">{instrument.name}</div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedInstrument}
            className="bg-primary hover:bg-primary/90"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

