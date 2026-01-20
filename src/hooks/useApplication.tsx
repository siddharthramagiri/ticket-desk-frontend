import { useEffect, useState, useCallback } from "react";
import { Application } from "@/types";
import { addNewApplication, fetchAllApplications, fetchMyApplications, ownNewApplication } from "@/services/api";

export function useApplications() {
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    const loadApplications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchAllApplications();
            setAllApplications(response);
        } catch {
            setError("Could not load Applications");
        } finally {
            setLoading(false);
        }
    }, []);
    
    const addNewApp = useCallback(async (name: string) => {
        setLoading(true);
        try {
            const response = await addNewApplication(name);
            loadApplications();
        } catch {
            setError("Could not Add New Application");
        } finally {
            setLoading(false);
        }
    }, []);

    
    const loadMyApplications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchMyApplications();
            setMyApplications(response);
        } catch {
            setError("Could not load Applications");
        } finally {
            setLoading(false);
        }
    }, []);

    const ownApplication = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await ownNewApplication(id);
            loadMyApplications();
        } catch {
            setError("Could not load Applications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApplications();
        loadMyApplications();
    }, [loadApplications, loadMyApplications]);



    return {
        allApplications,
        myApplications,
        loading,
        error,
        loadApplications,
        addNewApp,
        loadMyApplications,
        ownApplication,
    };
}
