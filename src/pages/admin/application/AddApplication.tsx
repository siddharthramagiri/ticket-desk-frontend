import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';;
import { Application } from '@/types';


type AddTicketProps = {
  open: boolean;
  createNewApp: (name: string) => void;
  onClose: () => void;
  onCreated: () => void;
  myApplications: Application[]
};

function AddTicket({ open, createNewApp, onClose, onCreated, myApplications }: AddTicketProps) {

    const [name, setName] = useState("");


    const handleCreateApplication = async () => {
        try {
        await createNewApp(name);
            onClose();
            setName("");
            onCreated();
        } catch {
            alert("Failed to create ticket");
        }
    };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/5 z-50" />
        <DialogContent className='w-full max-w-xl'>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <Label className='py-2' htmlFor="Name">Name</Label>
                    <Input
                        id="Name"
                        value={name} placeholder='Application Name'
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-6">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateApplication}>Create Application</Button>
            </div>
        </DialogContent>
        </DialogPortal>
    </Dialog>
  )
}

export default AddTicket