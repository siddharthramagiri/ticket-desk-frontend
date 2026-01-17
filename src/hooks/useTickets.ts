import { useEffect, useState, useCallback } from "react";
import { Ticket } from "@/types";
import { fetchAllTickets, updateStatus } from "@/services/api";
import { useToast } from "./use-toast";

export function useTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);


  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllTickets();
      setTickets(response);
    } catch {
      setError("Could not load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    
  }, [loadTickets]);

  const updateStatusOptimistic = (ticketId, status) => {
    setTickets(ts =>
      ts.map(t => t.id === ticketId ? { ...t, status } : t)
    );

    setSelectedTicket(t =>
      t?.id === ticketId ? { ...t, status } : t
    );
  };

  const changeStatus = async (ticketId, status) => {
    const prev = tickets;

    updateStatusOptimistic(ticketId, status);

    try {
      await updateStatus(ticketId, status);

    } catch {
      setTickets(prev);
      toast({
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return {
    tickets,
    loading,
    error,
    reload: loadTickets,
    changeStatus
  };
}
