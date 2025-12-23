import { Layout } from "@/components/Layout";
import { useUser } from "@/hooks/use-auth";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { useDoctors, useCreateDoctor } from "@/hooks/use-doctors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Activity, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { InsertDoctor } from "@shared/schema";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: user } = useUser();
  const { data: appointments } = useAppointments();
  const { data: doctors } = useDoctors();
  const { mutate: updateStatus } = useUpdateAppointmentStatus();
  const { mutateAsync: createDoctor } = useCreateDoctor();
  const { toast } = useToast();

  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Partial<InsertDoctor>>({});

  // Redirect non-admins (though server protects data, UI should redirect)
  if (user && user.role !== 'admin') {
     window.location.href = '/dashboard';
     return null;
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDoctor(newDoctor as InsertDoctor);
      toast({ title: "Doctor added successfully" });
      setIsAddDoctorOpen(false);
      setNewDoctor({});
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed to add doctor", description: error.message });
    }
  };

  return (
    <Layout>
       <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
           <p className="text-muted-foreground">Manage hospital operations</p>
        </div>
        
        <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" /> Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Specialist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDoctor} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Name</Label>
                   <Input 
                      required 
                      placeholder="Dr. Name"
                      onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Specialization</Label>
                   <Input 
                      required 
                      placeholder="Cardiology"
                      onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})}
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Bio</Label>
                 <Input 
                    required 
                    placeholder="Short bio..."
                    onChange={e => setNewDoctor({...newDoctor, bio: e.target.value})}
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Availability</Label>
                   <Input 
                      required 
                      placeholder="Mon-Fri 9-5"
                      onChange={e => setNewDoctor({...newDoctor, availability: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Image URL</Label>
                   <Input 
                      required 
                      placeholder="https://..."
                      onChange={e => setNewDoctor({...newDoctor, imageUrl: e.target.value})}
                   />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                   <Label>Experience (years)</Label>
                   <Input 
                      type="number"
                      required 
                      onChange={e => setNewDoctor({...newDoctor, experience: Number(e.target.value)})}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Rating</Label>
                   <Input 
                      defaultValue="5.0"
                      onChange={e => setNewDoctor({...newDoctor, rating: e.target.value})}
                   />
                 </div>
               </div>
               <Button type="submit" className="w-full">Create Profile</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground font-medium">Total Appointments</p>
              <h3 className="text-3xl font-bold mt-2">{appointments?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground font-medium">Active Doctors</p>
              <h3 className="text-3xl font-bold mt-2">{doctors?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground font-medium">Total Patients</p>
              <h3 className="text-3xl font-bold mt-2">--</h3> {/* Placeholder as we don't have total patients count API yet */}
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="appointments" className="rounded-lg">Manage Appointments</TabsTrigger>
          <TabsTrigger value="doctors" className="rounded-lg">Manage Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
           <Card className="border-border/50">
             <CardHeader>
               <CardTitle>Recent Appointments</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-1">
                 {appointments?.map((apt) => (
                   <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border-b border-border/30 last:border-0">
                     <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                         {apt.id}
                       </div>
                       <div>
                         <p className="font-medium">Patient ID: {apt.patientId}</p>
                         <p className="text-sm text-muted-foreground">Dr. {apt.doctor.name} • {format(new Date(apt.date), 'MMM d, yyyy')}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{apt.status}</Badge>
                        {apt.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                              onClick={() => updateStatus({ id: apt.id, status: 'confirmed' })}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                              onClick={() => updateStatus({ id: apt.id, status: 'cancelled' })}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="doctors">
           <Card className="border-border/50">
             <CardHeader>
               <CardTitle>Medical Staff Directory</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid md:grid-cols-2 gap-4">
                 {doctors?.map(doc => (
                   <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                     <img src={doc.imageUrl} alt={doc.name} className="w-12 h-12 rounded-full object-cover bg-muted" />
                     <div>
                       <h4 className="font-bold">{doc.name}</h4>
                       <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
