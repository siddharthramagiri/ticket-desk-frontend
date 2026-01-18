import { useDevelopers } from '@/hooks/useDevelopers';
import { Sidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { Status, Ticket } from '@/types';
import { fetchPersonalTickets, fetchProjectTickets } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import StatusIcon from '@/components/StatusIcon';
import { getStatusColor, PriorityStyles } from '@/styles';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, UserIcon } from 'lucide-react';
import TicketDetails from '../support/TicketDetails';
import TicketDetailsDialog from './TicketDetailsDialog';
import { useTickets } from '@/hooks/useTickets';

const DeveloperPage = () => {
  const { developers, loading, error } = useDevelopers();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState(0);

  const { changeStatus } = useTickets();

  useEffect(() => {
    async function fetch() {
      console.log(selectedId);
    
      if(selectedId === 0) {
        const fetchedTickets = await fetchPersonalTickets();
        setTickets(fetchedTickets);
        console.log(fetchedTickets);
        
      } else {
        const fetchedTickets = await fetchProjectTickets(selectedId);
        setTickets(fetchedTickets);
        console.log(fetchedTickets);
      }
    } 

    fetch();

  }, [selectedId])

  return (
    <div className='flex min-h-screen'>
      <Sidebar developers={developers} selectedId={selectedId} setSelectedId={setSelectedId} />
      <div className='w-full p-4'>
        <Card className="w-full">
            <CardContent className="p-0">
              <ScrollArea className="h-[75vh] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tickets.map((ticket) => {
                    return (
                      <Card
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setSelectedTicketId(ticket.id)
                        }}
                        className={cn("cursor-pointer border-2 transition-all border-border hover:bg-slate-50 min-h-[180px] bg-slate-100")}
                      >
                        <CardContent className="p-6 space-y-4 h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold leading-snug line-clamp-2">
                              {ticket.title}
                            </h3>

                            <Badge
                              variant="secondary"
                              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}
                            >
                              <StatusIcon status={ticket.status} className="w-4 h-4" /> &nbsp;
                              {ticket.status}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                            {ticket.description}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                            <span className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4" />
                              {ticket.createdBy}
                            </span>

                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {/* {formatDate(ticket.createdAt)} */}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>

            <TicketDetailsDialog
              ticket={selectedTicket}
              open={!!selectedTicket}
              onClose={() => setSelectedTicket(null)}
              changeStatus={changeStatus}
            />
        </Card>
      </div>
    </div>
  );
};

export default DeveloperPage;