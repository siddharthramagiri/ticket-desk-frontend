import { NavLink } from "react-router-dom"
import { Users, Headset, Code2, LayoutDashboard } from "lucide-react"

export function Sidebar() {
  const base =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition hover:bg-muted"
  const active = "bg-muted font-medium"

  return (
    <aside className="w-64 border-r p-4">
      <h2 className="text-xl mb-6">Ticket Desk</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Admin
        </NavLink>

        <NavLink
          to="/client"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          <Users size={18} />
          Client
        </NavLink>

        <NavLink
          to="/support"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          <Headset size={18} />
          Support
        </NavLink>

        <NavLink
          to="/developer"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          <Code2 size={18} />
          Developer
        </NavLink>
      </nav>
    </aside>
  )
}
