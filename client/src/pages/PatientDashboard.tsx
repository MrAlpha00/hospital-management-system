import { Layout } from "@/components/Layout";
import { useUser } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useReports } from "@/hooks/use-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, Download, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { data: user } = useUser();
  const { data: appointments } = useAppointments();
  const { data: reports } = useReports();

  // Filter for patient-specific data
  const myAppointments = appointments?.filter(a => a.patientId === user?.id) || [];
  const myReports = reports?.filter(r => r.patientId === user?.id) || [];

  const upcomingAppts = myAppointments.filter(a => new Date(a.date) > new Date()).length;
  const pendingReports = myReports.length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20">
          <CardContent className="p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 font-medium">Upcoming Appointments</p>
                <h3 className="text-4xl font-bold mt-2">{upcomingAppts}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground font-medium">Medical Reports</p>
                <h3 className="text-4xl font-bold mt-2 text-foreground">{pendingReports}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground font-medium">Profile Status</p>
                <h3 className="text-xl font-bold mt-2 text-foreground">Active</h3>
                <p className="text-xs text-green-600 font-bold mt-1">● Verified Patient</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-12 rounded-xl w-full md:w-auto grid grid-cols-2 md:inline-flex">
          <TabsTrigger value="appointments" className="rounded-lg">My Appointments</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg">Medical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {myAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No appointments found.</p>
                  <Button variant="link" className="mt-2 text-primary" onClick={() => window.location.href='/doctors'}>
                    Book your first appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{apt.doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{apt.doctor.specialization}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {format(new Date(apt.date), "PPP p")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge variant="outline" className={`
                           ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 
                             apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                             'bg-gray-100 text-gray-700 border-gray-200'}
                         `}>
                           {apt.status}
                         </Badge>
                         <Button variant="ghost" size="icon">
                           <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="border-border/50 shadow-sm">
             <CardHeader>
              <CardTitle>Documents & Reports</CardTitle>
            </CardHeader>
            <CardContent>
               {myReports.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No reports uploaded yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-medium">{report.title}</p>
                           <p className="text-xs text-muted-foreground capitalize">{report.type}</p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" /> Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
