import { Application, Project, Role, Ticket, TicketComment, User } from "@/types";
import config from "./config";

const API_URL = config.apiUrl;
export default API_URL;


export const getAuthToken = (): string | null => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user).token;
};

export const call_api = async (url : string, method: string, body : {} = null) => {
    const token = getAuthToken();

    if(body === null) {
        const res = await fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return res;
    }

    console.log(body);
    const res = await fetch(url, {
        method: method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res;
}


export const fetchUsers = async (role : string) : Promise<User[]> => {
    const token = getAuthToken();
    const res = await call_api(`${API_URL}/private/users?role=${role}`, "GET");

    if(!res.ok) {
        throw new Error("Failed to load ")
    }

    return await res.json();
}


export const getProjects = async () : Promise<Project[]> => {
    const res = await call_api(`${API_URL}/private/projects`, "GET");

    if(!res.ok) {
        throw new Error("Failed to load ")
    }

    return await res.json();
}



export const fetchTicketsCreatedByUser = async () : Promise<Ticket[]> => {
    const response = await call_api(`${API_URL}/client/my`, "GET");

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    return await response.json();
}


export const fetchAllTickets = async () : Promise<Ticket[]> => {
    const response = await call_api(`${API_URL}/support/all-tickets`, "GET")

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    return await response.json();
}



export const fetchAllUsers = async (): Promise<User[]> => {
    const res = await call_api(`${API_URL}/admin/all-users`, "GET")
    
    if (!res.ok) throw new Error("Failed to fetch users")

    const data = await res.json();   
     
    return data.map(user => ({
        id: user.id,
        email: user.email,
        roles: Array.from(user.roles),
        token: null
    }))
}


export async function updateUserRole(userId: number, role: Role) {
    const res = await call_api(`${API_URL}/admin/update/${userId}/role?role=${role}`,"PUT")

    if (!res.ok) {
        throw new Error("Failed to update role")
    }
}


export async function createTicket({title, description, applicationId, priority, deadLine}) {
    const res = await call_api(`${API_URL}/client/add`, "POST", 
        {title, description, applicationId, priority, deadLine})

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }
    return res.json()
}


export async function updateStatus(id, newStatus) {
    const res = await call_api(`${API_URL}/support/ticket/${id}/status`, "PATCH", { status: newStatus });

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    return res.json()
}

export async function assignTicketToDeveloper(id: number, userId?: string, projectId?: string ) {
    
    const res = await call_api(`${API_URL}/support/assign/${id}`, "POST", {userId, projectId});
    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }
    const data = await res.json();
    console.log(data);
    
    return data;
}


export async function createNewProject({name, members}: {name:string, members:User[]}) : Promise<Project> {

    const res = await call_api(`${API_URL}/private/create-project`, "POST", {name, users: members} );
    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    return await res.json();
}

export async function getAllProjects() : Promise<Project[]> {
    const res = await call_api(`${API_URL}/private/myProjects`, "GET");
    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    return await res.json();
}


export async function removeTicketAssignee(ticketId: string, id: string) {
    const res = await call_api(`${API_URL}/delete/${ticketId}/assign?id=${id}`, "DELETE");
    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }
    return await res.json();
}


export async function fetchPersonalTickets() : Promise<Ticket[]> {

    const res = await call_api(`${API_URL}/private/get-my-tickets`, "GET");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data
}


export async function fetchProjectTickets(id: number) {
    const res = await call_api(`${API_URL}/private/get-project-tickets/${id}`, "GET");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data
}

export async function getComments(id: number) : Promise<TicketComment[]> {
    const res = await call_api(`${API_URL}/private/comments/${id}`, "GET");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data
}


export async function createComment(id: number, body:{comment:string, aiGenerated:boolean}) {
    const res = await call_api(`${API_URL}/private/comment/${id}`, "POSt", body);

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data
}



export async function fetchAllApplications() : Promise<Application[]> {
    const res = await call_api(`${API_URL}/public/apps`, "GET");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data;
}


export async function fetchMyApplications() : Promise<Application[]> {
    const res = await call_api(`${API_URL}/client/my-apps`, "GET");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data;
}


export async function ownNewApplication(id : number) {
    const res = await call_api(`${API_URL}/client/own-app/${id}`, "PUT");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data;
}

export async function addNewApplication(name : string) {
    const res = await call_api(`${API_URL}/admin/new-app/${name}`, "POST");

    if(!res.ok) {
        throw new Error("Failed to Create the Ticket");
    }

    const data = await res.json();
    return data;
}