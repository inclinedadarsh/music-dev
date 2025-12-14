"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useProjectStore } from "@/lib/store";
import TrackCard from "./TrackCard";
import GlobalControls from "./GlobalControls";
import AddInstrumentModal from "./AddInstrumentModal";
import Timeline from "./Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, List } from "lucide-react";
import type { Track, Column } from "@/lib/types";
import { initializeAudio } from "@/lib/audio";

const columns: { id: Column; title: string }[] = [
  { id: "melody", title: "MELODY" },
  { id: "harmony", title: "HARMONY" },
  { id: "rhythm", title: "RHYTHM" },
  { id: "bass", title: "BASS" },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { project, setProject, moveTrack, updateProjectName } = useProjectStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Initialize audio on mount
    initializeAudio();

    // If no project, redirect to home
    if (!project) {
      router.push("/");
    }
  }, [project, router]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getTracksForColumn = (columnId: Column): Track[] => {
    return project.tracks.filter((track) => track.column === columnId);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTrack = project.tracks.find((t) => t.id === active.id);
    if (!activeTrack) {
      setActiveId(null);
      return;
    }

    // Check if dropping on a column header
    const overColumn = columns.find((c) => c.id === over.id)?.id;
    if (overColumn) {
      moveTrack(active.id, overColumn);
    } else {
      // Check if dropping on another track (move to that track's column)
      const overTrack = project.tracks.find((t) => t.id === over.id);
      if (overTrack && overTrack.column !== activeTrack.column) {
        moveTrack(active.id, overTrack.column);
      }
    }

    setActiveId(null);
  };

  const activeTrack = activeId
    ? project.tracks.find((t) => t.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Input
              value={project.name}
              onChange={(e) => updateProjectName(e.target.value)}
              className="text-xl font-semibold border-none bg-transparent p-0 focus-visible:ring-0 max-w-md"
            />
            <GlobalControls />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTracks = getTracksForColumn(column.id);
              return (
                <div key={column.id} className="flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-foreground uppercase mb-1">
                      {column.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {columnTracks.length} tracks
                    </p>
                  </div>

                  <div
                    className="flex-1 min-h-[200px] p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                    id={column.id}
                  >
                    <SortableContext
                      items={[...columnTracks.map((t) => t.id), column.id]}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnTracks.map((track) => (
                        <TrackCard key={track.id} track={track} />
                      ))}
                    </SortableContext>

                    <Button
                      variant="outline"
                      className="w-full mt-4 border-dashed"
                      onClick={() => setShowAddModal(column.id)}
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTrack ? (
            <div className="opacity-50">
              <TrackCard track={activeTrack} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Timeline */}
      <div className="border-t border-border mt-8">
        <Timeline />
      </div>

      {/* Add Instrument Modal */}
      {showAddModal && (
        <AddInstrumentModal
          column={showAddModal}
          onClose={() => setShowAddModal(null)}
        />
      )}
    </div>
  );
}

