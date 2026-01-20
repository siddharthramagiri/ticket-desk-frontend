import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import DeadlinePicker from './DeadlinePicker';
import { createTicket } from '@/services/api';
import { Application } from '@/types';


type AddTicketProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  myApplications: Application[]
};

function AddTicket({ open, onClose, onCreated, myApplications }: AddTicketProps) {

    const [newTicket, setNewTicket] = useState({
        title: "",
        description: "",
        applicationId: 0,
        priority: "LOW",
        deadLine: "",
    });


    const handleCreateTicket = async () => {
        try {
        await createTicket({
            title: newTicket.title,
            description: newTicket.description,
            applicationId: newTicket.applicationId,
            priority: newTicket.priority,
            deadLine: new Date(newTicket.deadLine).toISOString(),
        });
        onClose();
        setNewTicket({
            title: "",
            description: "",
            applicationId: 0,
            priority: "LOW",
            deadLine: "",
        });
            onCreated();
        } catch {
            alert("Failed to create ticket");
        }
    };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/5 z-50" />
        <DialogContent className='w-full max-w-4xl'>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <Label className='py-2' htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={newTicket.title}
                            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label className='py-2' htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={newTicket.description}
                            onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label className='py-2' htmlFor="applicationName">Application Name</Label>
                        <Select
                            value={newTicket.applicationId ? String(newTicket.applicationId) : ""}
                                onValueChange={(value) =>
                                    setNewTicket({ ...newTicket, applicationId: Number(value) })
                                }
                            >
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Select Application" />
                            </SelectTrigger>

                            <SelectContent>
                                {myApplications.map(app => (
                                    <SelectItem key={app.id} value={String(app.id)}>
                                    {app.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>

                    <div className="flex flex-col">
                        <Label className='py-2' htmlFor="priority">Priority</Label>
                        <Select
                            value={newTicket.priority}
                            onValueChange={value => setNewTicket({ ...newTicket, priority: value })}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(level => (
                                <SelectItem key={level} value={level}>
                                {level}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-start justify-start">
                    <div className="w-full mt-2">
                        <DeadlinePicker
                            value={newTicket.deadLine}
                            onChange={val => setNewTicket({ ...newTicket, deadLine: val })}
                        />
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-6">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
            </div>
        </DialogContent>
        </DialogPortal>
    </Dialog>
  )
}

export default AddTicket