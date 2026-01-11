import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/auth/AuthContext"

export default function MainLayout() {
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");
    return (
        <div className="flex min-h-screen">
            
            {isAdmin && <Sidebar />}

            <main className="flex-1 pt-6 bg-background">
                <Outlet />
            </main>
        </div>
    )
}
