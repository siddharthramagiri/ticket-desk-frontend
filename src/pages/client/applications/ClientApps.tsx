import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/useApplication";
import { cn } from "@/lib/utils";

const ClientApps = () => {
  type FilterGroup = "MY" | "ALL";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterGroup>("MY");

  const { allApplications, myApplications, loadApplications, 
      addNewApp, loadMyApplications, ownApplication} = useApplications();

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadApplications(),
          loadMyApplications(),
        ]);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const isMyApp = (appId: number) =>  myApplications.some(myApp => myApp.id === appId);


  const displayedApps = filter === "MY" ? myApplications : allApplications;

  if (loading) return <p className="p-6 text-center text-gray-400">Loading Applications...</p>;

  return (
    <Card className="container mx-auto p-6 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-6 gap-4">
        <div>
          <CardTitle className="text-2xl font-thin">Client Dashboard.</CardTitle>
          <h1 className="text-3xl font-normal">Your Applications</h1>
          <p className="text-gray-500 mt-1">Manage and track your Applications</p>
        </div>
        <div className="flex gap-4">
          <Button variant={"default"} onClick={() => navigate("/client")}>
            Back
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={filter}
        className="mb-4 w-full md:w-1/4"
        onValueChange={value => setFilter(value as FilterGroup)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="MY">My Apps</TabsTrigger>
          <TabsTrigger value="ALL">All Apps</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card className="w-full">
        <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedApps.map((app) => {
                return (
                  <Card
                    key={app.id}
                    className={cn(
                      "cursor-pointer border-2 transition-all border-border hover:bg-slate-50 min-h-[180px] bg-slate-100"
                    )}
                  >
                    <CardContent className="p-6 space-y-4 h-full flex flex-col justify-between">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-sans leading-snug line-clamp-2">
                          {app.name}
                        </h3>

                        {/* Owned Tag */}
                        {filter === "ALL" && isMyApp(app.id) && (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            Owned
                          </span>
                        )}
                        {filter === "ALL" && !isMyApp(app.id) && (
                          <Button variant={'outline'}
                            size="sm"
                            onClick={() => ownApplication(app.id)}
                            className="mt-auto"
                          >
                            Own App
                          </Button>
                        )}
                      </div>

                    </CardContent>
                  </Card>

                );
              })}
            </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default ClientApps;
