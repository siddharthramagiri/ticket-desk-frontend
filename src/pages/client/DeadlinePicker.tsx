import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";



const DeadlinePicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  return (
    <div className="flex flex-col gap-4 items-start justify-start">
      {/* Input field */}
      <div className="flex flex-col w-50">
        <Label htmlFor="deadLine">Deadline</Label>
        <Input
          className="my-2"
          id="deadLine"
          type="datetime-local"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setSelectedDate(e.target.value ? new Date(e.target.value) : undefined);
          }}
        />
      </div>

      {/* Calendar */}
      <div className="w-full mt-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={date => {
            if (!date) return;
            setSelectedDate(date);

            // Convert to datetime-local string: YYYY-MM-DDTHH:MM
            const isoString = new Date(date).toISOString();
            const local = isoString.substring(0, 16); // "YYYY-MM-DDTHH:MM"
            onChange(local);
          }}
        />
      </div>
    </div>
  );
};


export default DeadlinePicker;