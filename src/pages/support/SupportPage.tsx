import { useState, useMemo } from 'react';
import { User as UserIcon, Clock, AlertCircle, LogOut, RefreshCwIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/authService';
import { Status } from '@/types';
import { getStatusColor, getStatusIcon } from "@/styles"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTickets } from '@/hooks/useTickets';
import TicketDetails from './TicketDetails';
import StatusIcon from '@/components/StatusIcon';

const SupportPage = () => {
  type IssueStatus = Status | "ALL";
  
  const [filter, setFilter] = useState<IssueStatus>("ALL");
  const [assignType, setAssignType] = useState<"USER" | "PROJECT">("USER");
  const { 
    tickets, error,
    loading: ticketsLoading,
    reload: reloadTickets, 
    changeStatus,
  } = useTickets();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const selectedTicket = useMemo(
    () => tickets.find(t => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );

  const navigate = useNavigate();
  
  const filteredTickets = filter === 'ALL'? tickets : tickets.filter(t => t.status === filter);

  // const [formData, setFormData] = useState({
  //   title: '',
  //   description: '',
  //   customer: ''
  // });

  // const statuses = [
  //   { value: 'all', label: 'All Tickets', color: 'gray' },
  //   { value: 'open', label: 'Open', color: 'blue' },
  //   { value: 'in-progress', label: 'In Progress', color: 'yellow' },
  //   { value: 'resolved', label: 'Resolved', color: 'green' },
  //   { value: 'closed', label: 'Closed', color: 'gray' }
  // ];

  // const createTicket = () => {
  //   if (!formData.title || !formData.customer) return;

  //   const newTicket = {
  //     id: tickets.length + 1,
  //     ...formData,
  //     status: 'open',
  //     createdAt: new Date(),
  //     comments: []
  //   };

  //   setTickets([...tickets, newTicket]);
  //   setFormData({ title: '', description: '', customer: '' });
  //   setShowCreateForm(false);
  // };


  // const addComment = (ticketId, comment) => {
  //   const newCommentObj = {
  //     author: "Agent",
  //     text: comment,
  //     timestamp: new Date()
  //   };

  //   setTickets(tickets.map(t => 
  //     t.id === ticketId ? { ...t, comments: [...t.comments, newCommentObj] } : t
  //   ));

  //   if (selectedTicket?.id === ticketId) {
  //     setSelectedTicket({
  //       ...selectedTicket,
  //       comments: [...selectedTicket.comments, newCommentObj]
  //     });
  //   }

  //   setNewComment('');
  // };

  // const generateAIReply = async () => {
  //   if (!selectedTicket) return;
    
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch("https://api.anthropic.com/v1/messages", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         model: "claude-sonnet-4-20250514",
  //         max_tokens: 1000,
  //         messages: [
  //           {
  //             role: "user",
  //             content: `You are a professional customer support agent. Draft a helpful, empathetic response to this support ticket:

  //               Title: ${selectedTicket.title}
  //               Description: ${selectedTicket.description}
  //               Customer: ${selectedTicket.customer}

  //               Previous comments:
  //               ${selectedTicket.comments.map(c => `- ${c.text}`).join('\n') || 'None'}

  //               Write a professional support response that:
  //               1. Acknowledges the issue
  //               2. Shows empathy
  //               3. Provides clear next steps or solutions
  //               4. Maintains a helpful tone

  //               Keep the response concise (2-3 paragraphs).`
  //           }
  //         ]
  //       })
  //     });

  //     const data = await response.json();
  //     const aiReply = data.content[0].text;
  //     setNewComment(aiReply);
  //   } catch (error) {
  //     console.error('Error generating AI reply:', error);
  //     setNewComment('Error generating reply. Please write manually.');
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if(ticketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-5xl font-thin text-gray-900 text-center">
          Loading...
        </h1>
      </div>
    )
  }

  return (
    <>
     <Card className="container mx-auto p-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-6 gap-4">
        <div>
          <CardTitle className="text-2xl font-thin">Support Dashboard.</CardTitle>
          <h1 className="text-3xl font-normal">All Tickets</h1>
          <p className="text-gray-500 mt-1">Manage → Assign → Track, Tickets</p>
        </div>
        <div className="flex gap-4">
          <Button variant={"default"} onClick={() => reloadTickets()}>
            <RefreshCwIcon />
          </Button>
          <Button variant={"default"}
            // onClick={() => setIsAddTicketOpen(true)}
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

      <Tabs
        value={filter}
        className="mb-4 w-full md:w-2/4"
        onValueChange={(value) => setFilter(value as IssueStatus)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value={"ALL"}>All {`(${tickets.length})`}</TabsTrigger>
          
          {["OPEN","IN_PROGRESS","RESOLVED","CLOSED"].map(tab => {
            return (
              <TabsTrigger value={tab}>
                {tab} {`(${tickets.filter(t => t.status === tab).length})`}
              </TabsTrigger>
          )})}
          
        </TabsList>
      </Tabs>

        <Card className="w-full">
          <CardContent className="p-0">
            <ScrollArea className="max-h-full">
              <div className="grid grid-cols-[30%_70%]">
                <div className="lg:col-span-1">
                  {filteredTickets.length === 0 ? (
                    <Card className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No tickets found</p>
                    </Card>
                  ) : (
                    <ScrollArea className="h-[75vh] pr-4">
                      <div className="space-y-3">
                        {filteredTickets.map((ticket) => {
                          return (
                            <Card
                              key={ticket.id}
                              onClick={() => setSelectedTicketId(ticket.id)}
                              className={cn(
                                "cursor-pointer border-2 transition-all border-border hover:bg-slate-50",
                                selectedTicket?.id === ticket.id
                                  ? "shadow-md bg-slate-50"
                                  : "bg-slate-100 "
                              )}
                            >
                              <CardContent className="p-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                                    {ticket.title}
                                  </h3>
                                  
                                  <Badge
                                    variant="secondary"
                                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}
                                  >
                                    <StatusIcon status={ticket.status} /> &nbsp;
                                    {ticket.status}
                                  </Badge>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {ticket.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <UserIcon className="w-3 h-3" />
                                    {ticket.createdBy}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(ticket.createdAt)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        )} 
                      </div>
                    </ScrollArea>
                  )}
                </div>
                
                <div>
                  <TicketDetails 
                    selectedTicket={selectedTicket}
                    assignType={assignType} setAssignType={setAssignType}
                    reloadTickets={reloadTickets} changeStatus={changeStatus}
                  />
                </div>
                
              </div>

            </ScrollArea>
          </CardContent>
        </Card>
      </Card>
    </>
  );
};

export default SupportPage;