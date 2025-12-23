import { Layout } from "@/components/Layout";
import { useDoctors } from "@/hooks/use-doctors";
import { DoctorCard } from "@/components/DoctorCard";
import { Doctor, InsertAppointment } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Doctors() {
  const { data: doctors, isLoading } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Booking Logic
  const { data: user } = useUser();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutateAsync: createAppointment, isPending: isBooking } = useCreateAppointment();
  
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const handleBookClick = (doctor: Doctor) => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to book an appointment.", variant: "destructive" });
      setLocation("/auth");
      return;
    }
    setSelectedDoctor(doctor);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !user) return;

    try {
      const appointmentData: InsertAppointment = {
        patientId: user.id,
        doctorId: selectedDoctor.id,
        date: new Date(date).toISOString(), // Form input is YYYY-MM-DDTHH:mm
        reason,
        status: "pending" // Add required field
      };
      
      await createAppointment(appointmentData);
      toast({ title: "Success!", description: "Your appointment request has been sent." });
      setSelectedDoctor(null);
      setDate("");
      setReason("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <Layout>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Meet Our Specialists</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our team of highly qualified doctors across various specializations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-[400px] rounded-3xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors?.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBookClick} />
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Booking with Dr. {selectedDoctor?.name} ({selectedDoctor?.specialization})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input 
                id="date" 
                type="datetime-local" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea 
                id="reason" 
                placeholder="Briefly describe your symptoms..." 
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full rounded-lg" disabled={isBooking}>
                {isBooking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
