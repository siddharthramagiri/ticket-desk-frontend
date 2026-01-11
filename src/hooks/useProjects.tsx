import { useEffect, useState } from "react";
import { Project } from "@/types";
import { getProjects } from "@/services/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const projects = await getProjects();

            if (isMounted) {
                setProjects(projects);
            }
        } catch (err) {
            if (isMounted) {
                setError("Failed to load projects");
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading, error };
}
