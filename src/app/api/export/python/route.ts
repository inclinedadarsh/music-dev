import { NextRequest, NextResponse } from "next/server";
import { generatePythonCode } from "@/lib/cline";
import type { Project } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { project } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: "Project is required" },
        { status: 400 }
      );
    }

    const code = generatePythonCode(project as Project);
    const filename = `${project.name.replace(/\s+/g, "_")}.py`;

    return NextResponse.json({ code, filename });
  } catch (error) {
    console.error("Error generating Python code:", error);
    return NextResponse.json(
      { error: "Failed to generate Python code" },
      { status: 500 }
    );
  }
}

