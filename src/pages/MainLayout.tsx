import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/auth/AuthContext"
import Navbar from "@/components/Navbar";

export default function MainLayout() {
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");
    return (
        <div className="flex min-h-screen">
            {isAdmin && <Sidebar />}
            <div className="flex flex-col flex-1">
                {user && <Navbar />}
                <main className="flex-1 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
