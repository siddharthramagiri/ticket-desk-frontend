import { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, User as UserIcon, Clock, AlertCircle, LogOut, TicketsPlane, RefreshCwIcon, CheckIcon } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/authService';
import { Status } from '@/types';
import { getStatusColor, getStatusIcon } from "@/styles"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useTickets } from '@/hooks/useTickets';
import { assignTicketToDeveloper } from '@/services/api';

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
  
  const { 
    developers, projects, 
    loading: assignmentLoading
  } = useAssignmentData();

  const navigate = useNavigate();
  
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newComment, setNewComment] = useState('');

  
  const selectedTicket = useMemo(
    () => tickets.find(t => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );

  const [draftStatus, setDraftStatus] = useState<Status>(selectedTicket?.status ?? "OPEN");
  const [draftAssignee, setDraftAssignee] = useState<{ userId?: string; projectId?: string }>({});

  useEffect(() => {
    if (selectedTicket) {
      setDraftStatus(selectedTicket.status);
      setDraftAssignee({});
    }
  }, [selectedTicket]);

  const handleSave = async () => {
    try {
      if (draftStatus !== selectedTicket.status) {
        await changeStatus(selectedTicket.id, draftStatus);
      }

      if (draftAssignee.userId || draftAssignee.projectId) {
        await assignTicket(selectedTicket.id, draftAssignee);
      }

      alert("Ticket updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket.");
    }
  };
  
  
  const filteredTickets = filter === 'ALL'? tickets : tickets.filter(t => t.status === filter);

  const assignTicket = async (ticketId: number, payload: { userId?: string; projectId?: string }) => {
    await assignTicketToDeveloper(ticketId, payload.userId, payload.projectId);
    reloadTickets();
  };

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
                          const StatusIcon = getStatusIcon(ticket.status)
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
                                    <StatusIcon /> &nbsp;
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
                  <ScrollArea className="h-[75vh] pr-4">
                  <div className="lg:col-span-2 mb-10">
                    {selectedTicket ? (
                      <Card>
                        {/* Header */}
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl">
                                {selectedTicket.title}
                              </CardTitle>

                              <CardDescription className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-4 h-4" />
                                  {selectedTicket.createdBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(selectedTicket.createdAt)}
                                </span>
                              </CardDescription>
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                              <Button
                                onClick={handleSave}
                                disabled={
                                  draftStatus === selectedTicket.status &&
                                  !draftAssignee.userId &&
                                  !draftAssignee.projectId
                                }
                              >
                                <CheckIcon />
                              </Button>

                              <Select
                                value={draftStatus}
                                onValueChange={(value) => setDraftStatus(value as Status)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">Open</SelectItem>
                                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                                  <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                          </div>
                          <div>
                            {selectedTicket.status === "OPEN" && (
                              <Card>
                                <CardContent className="space-y-4 pt-4 justify-between">
                                    <h4 className="font-semibold">Assign Ticket</h4>

                                    {/* Choose assignment type */}
                                    <div className="flex items-center gap-3">
                                      <Label>Single Developer</Label>
                                      <Switch
                                        checked={assignType === "PROJECT"}
                                        onCheckedChange={(checked) =>
                                          setAssignType(checked ? "PROJECT" : "USER")
                                        }
                                      />
                                      <Label>Project Team</Label>
                                    </div>

                                    {/* Assign to User */}
                                    {assignType === "USER" && (
                                      <Select
                                      onValueChange={(userId) =>
                                        setDraftAssignee({ userId })
                                      }
                                      >
                                        <SelectTrigger className="w-64">
                                          <SelectValue placeholder="Select Developer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {developers.map((dev) => (
                                            <SelectItem key={dev.id} value={String(dev.id)}>
                                              {dev.email}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}

                                    {/* Assign to Project */}
                                    {assignType === "PROJECT" && (
                                      <Select
                                      onValueChange={(projectId) =>
                                        setDraftAssignee({ projectId })
                                      }
                                      >
                                        <SelectTrigger className="w-64">
                                          <SelectValue placeholder="Select Project Team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {projects.map((project) => (
                                            <SelectItem key={project.id} value={String(project.id)}>
                                              {project.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                </CardContent>
                              </Card>
                            )}
                            
                          </div>
                        </CardHeader>

                        <Separator />

                        {/* Description */}
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">
                            {selectedTicket.description}
                          </p>
                        </CardContent>

                        <Separator />

                        {/* Comments */}
                        <CardContent>
                          <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5" />
                            Activity & Comments
                          </h3>

                          {/* <div className="space-y-4 mb-6">
                            {selectedTicket.comments.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No comments yet
                              </p>
                            ) : (
                              selectedTicket.comments.map((comment, idx) => (
                                <Card key={idx} className="bg-muted/50">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between mb-2">
                                      <span className="text-sm font-medium">
                                        {comment.author}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDate(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div> */}

                          <Separator className="mb-6" />

                          {/* Add Comment */}
                          <div className="space-y-4">
                            <Button
                              disabled={isGenerating}
                              variant="outline"
                              className="flex items-center gap-2 text-purple-800 border-purple-800 hover:text-purple-600
                                bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
                            >
                              <Sparkles className="w-4 h-4" />
                              {isGenerating ? "Generating..." : "Draft AI Reply"}
                            </Button>

                            <Textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment or use AI to draft a reply..."
                            />

                            <div className="flex justify-end">
                              <Button
                                disabled={!newComment.trim()}
                                className="flex items-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="p-12 text-center">
                        <TicketsPlane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <CardTitle>Select a ticket</CardTitle>
                        <CardDescription className="mt-2">
                          Choose a ticket from the list to view details and add comments
                        </CardDescription>
                      </Card>
                    )}
                  </div>
                  </ScrollArea>
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