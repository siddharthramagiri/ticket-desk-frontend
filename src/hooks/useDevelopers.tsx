import { useEffect, useState } from "react";
import { User } from "@/types";
import { fetchUsers } from "@/services/api";

export function useDevelopers() {
  const [developers, setDevelopers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const developers = await fetchUsers("DEVELOPER")

            if (isMounted) {
                setDevelopers(developers);
            }
        } catch (err) {
            if (isMounted) {
                setError("Failed to load developers");
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    fetchDevelopers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { developers, loading, error };
}
