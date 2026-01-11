import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types';
import { PriorityStyles } from '@/styles';


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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/5 z-50" />

        <DialogContent className="w-[95vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {ticket.title}
              <Badge
                variant="outline"
                className={`uppercase text-xs ${PriorityStyles[ticket.priority]}`}
              >
                {ticket.priority}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Application</p>
              <p className="font-medium">{ticket.applicationName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="whitespace-pre-line">
                {ticket.description || "—"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-medium ${
                    ticket.status === "CLOSED"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {ticket.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">
                  {new Date(ticket.deadLine).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}


export default TicketDetailsDialog;