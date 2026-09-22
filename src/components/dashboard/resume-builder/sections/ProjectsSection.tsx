"use client";

import { ChevronDown, ChevronUp, FolderGit2, Plus, Trash2 } from "lucide-react";
import { generateId } from "../resumeBuilder.utils";
import type { ResumeProjectItem } from "../types";

interface ProjectsSectionProps {
  projects: ResumeProjectItem[];
  onChange: (projects: ResumeProjectItem[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ProjectsSection({
  projects,
  onChange,
  isOpen,
  onToggle,
}: ProjectsSectionProps) {
  const addProject = () => {
    const newProj: ResumeProjectItem = {
      id: generateId(),
      title: "",
      role: "",
      link: "",
      github: "",
      techStack: [],
      description: "",
      highlights: [""],
    };
    onChange([...projects, newProj]);
  };

  const updateProject = (id: string, fields: Partial<ResumeProjectItem>) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, ...fields } : p)),
    );
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Projects & Open Source ({projects.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addProject}
            className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 cursor-pointer text-slate-400"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Remove project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) =>
                      updateProject(proj.id, { title: e.target.value })
                    }
                    placeholder="Distributed Analytics Engine"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Contribution
                  </label>
                  <input
                    type="text"
                    value={proj.role || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { role: e.target.value })
                    }
                    placeholder="Sole Creator / Lead"
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live URL / Demo Link
                  </label>
                  <input
                    type="text"
                    value={proj.link || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { link: e.target.value })
                    }
                    placeholder="https://projectdemo.com"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Repository Link
                  </label>
                  <input
                    type="text"
                    value={proj.github || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { github: e.target.value })
                    }
                    placeholder="github.com/user/project"
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={proj.techStack.join(", ")}
                  onChange={(e) =>
                    updateProject(proj.id, {
                      techStack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Next.js, TypeScript, ClickHouse, Docker"
                  className="input-field text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, { description: e.target.value })
                  }
                  placeholder="Key impact, architecture highlights, or metrics..."
                  className="input-field text-xs w-full leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
