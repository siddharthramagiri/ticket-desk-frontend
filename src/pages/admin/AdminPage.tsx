import { useEffect, useState } from "react"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { fetchAllUsers, updateUserRole } from "@/services/api"
import { Role, User } from "@/types"
import { logout } from "@/services/authService"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

const ROLES = ["ADMIN", "DEVELOPER", "CLIENT", "SUPPORT"]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
        const data = await fetchAllUsers()
        console.log(data);
        
        setUsers(data);
    }
    fetch();
  }, [])

  const handleRoleChange = async (userId: number, role: Role) => {
    setLoading(true)
    try {
      await updateUserRole(userId, role)
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, roles: [role] } : user
        )
      )
      toast.success("Role updated successfully")
    } catch {
      toast.error("Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-6xl mx-auto mt-10">
      <div className="flex flex-wrap justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-thin">Admin Dashboard.</CardTitle>
          <h1 className="text-3xl font-normal">Users Management</h1>
        </CardHeader>

        <Button variant={"outline"}
            className=" hover:bg-red-600 hover:text-white"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout <LogOut />
        </Button>
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <Select
                    defaultValue={user.roles[0]}
                    onValueChange={(value) =>
                      handleRoleChange(user.id, value as Role)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-right">
                  <Button disabled={loading} size="sm">
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
