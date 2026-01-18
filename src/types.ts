export type Role = "ADMIN" | "SUPPORT" | "DEVELOPER" | "CLIENT";
export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";


export interface User {
  id      : number;
  email   : string;
  roles   : Role[];
  token?  : string;
}


export interface Ticket {
  id              : number;
  title           : string;
  description     : string;
  applicationName : string;
  priority        : Priority;
  status          : Status;
  createdBy       : string;
  createdAt       : string;
  updatedAt       : string;
  deadLine?       : string;

  assignees: TicketAssignee[];
};

export interface TicketComment {
  id          : number;
  user        : User;
  comment     : string;
  aiGenerated : boolean;
  createdAt?  : string;
}

export interface Project {
  id          : number;
  name        : string;
  members?    : User[];
}


export interface TicketAssignee {
  id          : number;
  user?       : User;
  project?    : Project;
  assignedBy  : User;
  assignedAt  : string;
}


