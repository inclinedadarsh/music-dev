"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  GripVertical,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Track } from "@/lib/types";
import { useProjectStore } from "@/lib/store";
import { playTrack, stopAll } from "@/lib/audio";
import NoteEditor from "./NoteEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackCardProps {
  track: Track;
}

const instrumentIcons: Record<string, string> = {
  piano: "🎹",
  guitar: "🎸",
  drums: "🥁",
  bass: "🎸",
  strings: "🎻",
  synth: "🎚️",
  brass: "🎺",
  woodwinds: "🎷",
};

export default function TrackCard({ track }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { updateTrackVolume, removeTrack, updateTrack } = useProjectStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePlay = async () => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playTrack(track);
      // Stop after a delay (simplified)
      setTimeout(() => setIsPlaying(false), 4000);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    updateTrackVolume(track.id, value[0] / 100);
  };

  const handleDelete = () => {
    removeTrack(track.id);
    setShowDeleteDialog(false);
  };

  const handleMute = () => {
    updateTrack(track.id, { muted: !track.muted });
  };

  const notesPreview = track.notes
    .slice(0, 3)
    .map((n) => n.pitch)
    .join(", ");

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className="mb-4 cursor-move hover:shadow-lg transition-shadow"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-2xl">
                {instrumentIcons[track.instrument] || "🎵"}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {track.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Notes: {notesPreview}
                  {track.notes.length > 3 && "..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {Math.ceil(track.notes.length / 4)} bars
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleMute}
              >
                {track.muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[track.volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
                disabled={track.muted}
              />
              <span className="text-xs text-muted-foreground w-12 text-right">
                {Math.round(track.volume * 100)}%
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Track</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{track.name}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <NoteEditor track={track} onClose={() => setShowEditDialog(false)} />
      )}
    </>
  );
}

