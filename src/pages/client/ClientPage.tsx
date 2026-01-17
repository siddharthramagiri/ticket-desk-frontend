import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddTicket from "./AddTicket";
import { fetchTicketsCreatedByUser } from "@/services/api";
import { logout } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import TicketDetailsDialog from "./TicketDetailsDialog";
import { Status, Ticket } from "@/types";
import { getStatusColor, PriorityStyles, getStatusIcon } from "@/styles"
import StatusIcon from "@/components/StatusIcon";

const ClientPage = () => {
  type FilterGroup = "ACTIVE" | "DONE";
  const statusMap: Record<FilterGroup, Status[]> = {
    ACTIVE: ["OPEN", "IN_PROGRESS"],
    DONE: ["RESOLVED", "CLOSED"],
  };

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterGroup>("ACTIVE");
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);


  const navigate = useNavigate();

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchTicketsCreatedByUser();
      setTickets(response);
    } catch {
      setError("Could not load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    statusMap[filter].includes(ticket.status)
  );


  if (loading) return <p className="p-6 text-center text-gray-400">Loading tickets...</p>;

  return (
    <Card className="container mx-auto p-6 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-6 gap-4">
        <div>
          <CardTitle className="text-2xl font-thin">Client Dashboard.</CardTitle>
          <h1 className="text-3xl font-normal">Your Raised Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and track your submitted tickets</p>
        </div>
        <div className="flex gap-4">
          <Button variant={"default"}
            onClick={() => setIsAddTicketOpen(true)}
          >
            + Add New Ticket
          </Button>

          <Button variant={"outline"}
            className=" hover:bg-red-600 hover:text-white"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={filter}
        className="mb-4 w-full md:w-1/4"
        onValueChange={value => setFilter(value as FilterGroup)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ACTIVE">Active Issues</TabsTrigger>
          <TabsTrigger value="DONE">Completed Issues</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No {filter === "ACTIVE" ? "Active" : "Finished"} tickets found.
        </p>
      ) : (
        <Card className="w-full">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[70vh]">
              <div className="divide-y divide-gray-100">
                {filteredTickets.map(ticket => {
                  return(
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md hover:bg-slate-100 cursor-pointer gap-2"
                    >
                      {/* Left */}
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-1">
                        <Badge
                          variant={"outline"}
                          className={`uppercase px-2 py-1 text-xs font-semibold ${PriorityStyles[ticket.priority]}`}
                        >
                          {ticket.priority}
                        </Badge>

                        <div>
                          <h2 className="font-medium text-lg">{ticket.title}</h2>
                          <p className="text-sm text-gray-500">{ticket.applicationName}</p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-start md:items-end text-sm md:mt-0 gap-1">
                        <Badge
                          variant="secondary"
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}
                        >
                          <StatusIcon status={ticket.status} /> &nbsp;
                          {ticket.status}
                        </Badge>
                        <span className="text-gray-500 text-xs">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}


      <AddTicket
        open={isAddTicketOpen}
        onClose={() => setIsAddTicketOpen(false)}
        onCreated={loadTickets}
      />
      <TicketDetailsDialog
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </Card>
  );
};

export default ClientPage;
