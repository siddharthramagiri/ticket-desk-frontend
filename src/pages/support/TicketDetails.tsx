import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckIcon, Clock, MessageSquare, Send, Sparkles, TicketsPlane, UserIcon, XCircle as X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Status } from '@/types';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useEffect, useMemo, useState } from 'react';
import { assignTicketToDeveloper, removeTicketAssignee } from '@/services/api';
import { useComments } from '@/hooks/useComments';



const TicketDetails = ( { selectedTicket, assignType, setAssignType, reloadTickets, changeStatus } ) => {
    
    const [draftStatus, setDraftStatus] = useState<Status>(selectedTicket?.status ?? "OPEN");
    const [draftAssignees, setDraftAssignees] = useState<
        { id?: number; userId?: string; projectId?: string }[]
    >([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newComment, setNewComment] = useState('');
    const {comments, commentsLoading, error, sendComment, loadComments } = useComments(selectedTicket);
    
    const { 
        developers, projects, 
        loading: assignmentLoading
    } = useAssignmentData();

    useEffect(() => {
        if (!selectedTicket) return;

        setDraftStatus(selectedTicket.status);
        setDraftAssignees(selectedTicket.assignees ?? []);

        setDraftAssignees(
            (selectedTicket.assignees ?? []).map((a) => ({
                id: a.id,
                userId: a.user?.id ? String(a.user.id) : undefined,
                projectId: a.project?.id ? String(a.project.id) : undefined,
            }))
        );

    }, [selectedTicket]);

    const removeDraftAssignee = (assigneeId?: number, index?: number) => {
        setDraftAssignees((prev) =>
        assigneeId
            ? prev.filter((a) => a.id !== assigneeId)
            : prev.filter((_, i) => i !== index)
        );
    };
    
    const handleSave = async () => {
        if (!selectedTicket) return;
        try {
            setSaving(true);

            if (draftStatus !== selectedTicket.status) {
                await changeStatus(selectedTicket.id, draftStatus);
            }

            const original = selectedTicket.assignees ?? [];

            const added = draftAssignees.filter((a) => !a.id);
            const removed = original.filter(
                (o) => !draftAssignees.find((d) => d.id === o.id)
            );

            await Promise.all([
                ...added.map((a) =>
                assignTicketToDeveloper(
                    selectedTicket.id,
                    a.userId,
                    a.projectId
                )
                ),
                ...removed.map((a) =>
                    removeTicketAssignee(selectedTicket.id, a.id)
                ),
            ]);

            alert("Ticket updated successfully!");
            reloadTickets();
        } catch (err) {
            console.error(err);
            alert("Failed to update ticket.");
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = useMemo(() => {
        if (!selectedTicket) return false;

        if (draftStatus !== selectedTicket.status) return true;

        const original = selectedTicket.assignees ?? [];

        if (original.length !== draftAssignees.length) return true;

        return original.some(
            (o) => !draftAssignees.find((d) => d.id === o.id)
        );
    }, [draftStatus, draftAssignees, selectedTicket]);


    

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
        <ScrollArea className="h-[75vh] pr-4">
            <div className="lg:col-span-2 mb-10">
            {selectedTicket ? (
                <Card>
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
                            <Button onClick={handleSave}
                                disabled={!hasChanges || saving}
                            > <CheckIcon />
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
                                    onValueChange={(userId) => {
                                        setDraftAssignees((prev) => {
                                            if (prev.some((a) => a.userId === userId)) return prev;
                                            return [...prev, { userId }];
                                        })
                                    }}
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
                                    onValueChange={(projectId) =>{
                                        setDraftAssignees((prev) => {
                                            if (prev.some((a) => a.projectId === projectId)) return prev;

                                            return [...prev, { projectId }];
                                        })
                                    }}
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
                    <div className="flex flex-wrap gap-2">
                      <p className='font-semibold'>Assignees : </p>
                        {draftAssignees.length > 0? draftAssignees.map((a, i) => (
                            <div
                            key={a.id ?? i}
                            className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                            >
                            <span>
                                {a.userId
                                ? developers.find((d) => String(d.id) === a.userId)?.email
                                : projects.find((p) => String(p.id) === a.projectId)?.name}
                            </span>
                            <button onClick={() => removeDraftAssignee(a.id, i)}>
                                <X className="w-4 h-4" />
                            </button>
                            </div>
                        )): <p> None </p>}
                        </div>
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
                <CardContent className="flex-1 overflow-y-auto mt-3">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5" />
                        Activity & Comments
                    </h3>

                    <ScrollArea className="h-64 pr-4 mb-6">
                        <div className="space-y-4 mb-6">
                            {comments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No comments yet
                                </p>
                                ) : (
                                    comments.map((comment, idx) => (
                                        <Card key={idx} className="bg-muted/50">
                                        <CardContent className="p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">
                                            {comment.user?.email}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm">{comment.comment}</p>
                                        </CardContent>
                                    </Card>
                                    ))
                                )
                            }
                        </div>
                    </ScrollArea>
                    
                    </CardContent>

                    {/* Add Comment */}
                    <CardContent className="bg-background">
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
                                rows={4}
                                className="resize-none"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment or use AI to draft a reply..."
                            />

                            <div className="flex justify-end">
                                <Button
                                    disabled={!newComment.trim()}
                                    className="flex items-center gap-2"
                                    onClick={() => sendComment(newComment)}
                                >
                                    <Send className="w-4 h-4"/>
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
    </>
  )
}

export default TicketDetails