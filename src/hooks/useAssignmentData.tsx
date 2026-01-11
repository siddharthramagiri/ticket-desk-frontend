import { useEffect, useState } from "react";
import { User, Project } from "@/types";
import API_URL, { fetchUsers, getProjects } from "@/services/api";

export function useAssignmentData() {
  const [developers, setDevelopers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
        try {
            const [devRes, projectRes] = await Promise.all([
                fetchUsers("DEVELOPER"),
                getProjects(),
            ]);

            console.log(devRes);

            if (isMounted) {
                setDevelopers(devRes);
                setProjects(projectRes);
            }
        } catch (err) {
            if (isMounted) {
                setError("Failed to load assignment data");
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { developers, projects, loading, error };
}
