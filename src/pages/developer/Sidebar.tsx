import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useDevelopers } from "@/hooks/useDevelopers"
import { useEffect, useState } from "react"



import { User, Project } from "@/types";
import { X } from "lucide-react";
import { createNewProject, getAllProjects } from "@/services/api"
import { useNavigate } from "react-router-dom"


export function Sidebar({ developers, selectedId, setSelectedId }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const fetchedProjects = await getAllProjects();
      console.log(fetchedProjects);
      
      setProjects(fetchedProjects);
    }
    fetch();
  }, [])

  const base = "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition hover:bg-muted";
  const active = "bg-muted font-medium";

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r p-4">
        {/* Top content */}
        <div>
          <CardTitle className="text-2xl font-thin">Developer Dashboard.</CardTitle>
          <h1 className="text-3xl font-normal">Resolve Issues & Bugs</h1>

          <br /><br />

          <div className="space-y-3">
            <div
              onClick={() => setSelectedId(0)}
              className={`${base} ${selectedId === 0 ? active : ""}`}
            >
              Personal Tickets
            </div>

            <Separator />

            <div className="space-y-2">
              <Button onClick={() => setShowDialog(true)} className="mt-2 w-full">
                + Create New Project
              </Button>

              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className={`${base} ${selectedId === project.id ? active : ""}`}
                >
                  {project.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {showDialog && (
        <CreateProjectDialog
          developers={developers}
          onClose={() => setShowDialog(false)}
          onCreate={(newProject) => {
            setProjects((prev) => [...prev, newProject]);
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}

// Dialog Component
interface CreateProjectDialogProps {
  developers: User[];
  onClose: () => void;
  onCreate: (project: Project) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  developers,
  onClose,
  onCreate,
}) => {
  const [projectName, setProjectName] = useState("");
  const [selectedDevIds, setSelectedDevIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDev = (id: string) => {
    setSelectedDevIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    const newProject = {
      name: projectName,
      members: developers.filter((d) => selectedDevIds.includes(String(d.id))),
    };

    const project:Project = await createNewProject(newProject);


    onCreate(project);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set project name and select developers for this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Project Name */}
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {/* Developer Selection */}
          <div className="relative mt-4 w-full max-w-sm">
            <Button
              className="w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedDevIds.length === 0
                ? "Select Developers"
                : `${selectedDevIds.length} selected`}
              <svg
                className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </Button>

            {dropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fadeIn">
                {developers.map((dev) => (
                  <div
                    key={dev.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors duration-200"
                    onClick={() => toggleDev(String(dev.id))}
                  >
                    <span className="text-gray-700">{dev.email}</span>
                    {selectedDevIds.includes(String(dev.id)) && (
                      <span className="text-indigo-600 font-semibold">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Selected Developers as tags */}
          <div className="flex flex-wrap gap-2">
            {selectedDevIds.map((id) => {
              const dev = developers.find((d) => String(d.id) === id);
              if (!dev) return null;
              return (
                <div key={id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                  <span>{dev.email}</span>
                  <button onClick={() => toggleDev(id)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!projectName.trim()}>
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
