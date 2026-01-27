import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types';
import { getStatusColor, PriorityStyles } from '@/styles';
import StatusIcon from '@/components/StatusIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Send, UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useComments } from '@/hooks/useComments';
import { ScrollArea } from '@/components/ui/scroll-area';


type TicketDetailsDialogProps = {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
};

function TicketDetailsDialog({
  ticket,
  open,
  onClose,
}: TicketDetailsDialogProps) {
  if (!ticket) return null;


  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const [newComment, setNewComment] = useState('');
  const {comments, commentsLoading, error, sendComment, loadComments } = useComments(ticket);

  const handleSendComment = async () => {
      try {
        await sendComment(newComment);
      } catch (err) {
        console.log(err);
      } finally {
        setNewComment("");
      }
  }

  
  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])
    
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/5 z-50" />

        <DialogContent className="w-[98vw] max-w-6xl h-[90vh] max-h-[90vh] p-0">
          <Card className="h-full flex flex-col">
          <CardHeader>
              <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">
                      <CardTitle className="text-xl">
                      {ticket.title}
                      </CardTitle>

                      <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          {ticket.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(ticket.createdAt)}
                      </span>
                      </CardDescription>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                      <Badge
                        variant="secondary"
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}
                      >
                        <StatusIcon status={ticket.status} /> &nbsp;
                        {ticket.status}
                      </Badge>
                  </div>

              </div>
              <div>
              <div className="flex flex-wrap gap-2 mt-2">
                  <p className='font-semibold'>Assigned to : </p>
                  {ticket.assignees.length > 0?
                   ticket.assignees.map((a, i) => (
                      <div
                        key={a.id ?? i}
                        className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                      >
                        <span>
                            { a.user ? (a.user)?.email : (a.project)?.name }
                        </span>
                      </div>
                  )): 
                  <p>None</p>
                  }
                  </div>
              </div>
          </CardHeader>

        <Separator />

          <CardContent className="pt-8">
            <p className="text-base leading-relaxed text-muted-foreground">
              {ticket.description}
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
                  
                  <div ref={bottomRef} />
                </div> 
              </ScrollArea>
             
            </CardContent>

              {/* Add Comment */}
            <CardContent className="bg-background">
              <div className="space-y-4">
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
                    onClick={handleSendComment}
                  >
                    <Send className="w-4 h-4"/>
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}


export default TicketDetailsDialog;