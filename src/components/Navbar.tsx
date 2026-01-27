import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <header className="w-full h-14 px-6 flex items-center justify-between border-b bg-background">
        <div className="flex flex-col">
            <span className="text-sm font-medium">{user.email}</span>
            <span className="text-xs text-muted-foreground">
                {user.roles.includes("ADMIN")? "ADMIN" : user.roles[0]}
            </span>
        </div>
        <Button variant={"outline"}
            className=" hover:bg-red-600 hover:text-white"
            onClick={() => {
                signOut();
                navigate("/login");
            }}
            >
            Logout <LogOut />
        </Button>
    </header>
  )
}
