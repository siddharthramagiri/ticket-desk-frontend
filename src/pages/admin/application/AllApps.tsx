import { useEffect, useState } from "react"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useApplications } from "@/hooks/useApplication"
import AddTicket from "./AddApplication"


const AllApps = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  const { allApplications, myApplications, loadApplications, addNewApp} = useApplications();

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadApplications()
        ]);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <div>
      <Card className="max-w-6xl mx-auto mt-10">
        <div className="flex flex-wrap justify-between">
          <CardHeader>
            <CardTitle className="text-2xl font-thin">Admin Dashboard.</CardTitle>
            <h1 className="text-3xl font-normal">Applications Management</h1>
          </CardHeader>

          <div className="flex gap-4">
            <Button variant={"default"} onClick={() => setIsAddApplicationOpen(true)}>
              +
            </Button>

            <Button variant={"outline"} onClick={() => navigate("/admin")}>
              Back
            </Button>
          </div>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>All Applications</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {allApplications.map(app => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>

                  <TableCell className="text-right">
                    <Button disabled={loading} size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTicket
        open={isAddApplicationOpen}
        createNewApp={addNewApp}
        onClose={() => setIsAddApplicationOpen(false)}
        onCreated={loadApplications}
        myApplications={myApplications}
      />
    </div>
  );
};

export default AllApps;
