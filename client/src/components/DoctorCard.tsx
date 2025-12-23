import { type Doctor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <div className="group relative bg-card rounded-3xl border border-border/50 p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          Top Rated
        </div>
      </div>
      
      <div className="flex gap-4 items-start mb-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0">
          <img 
            src={doctor.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"} 
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">{doctor.name}</h3>
          <p className="text-primary font-medium text-sm mb-2">{doctor.specialization}</p>
          <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{doctor.rating}</span>
            <span className="text-muted-foreground font-normal ml-1">({doctor.experience} yrs exp)</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
        {doctor.bio}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 bg-muted/50 p-3 rounded-xl">
        <Clock className="w-4 h-4 text-primary" />
        {doctor.availability}
      </div>

      <Button 
        onClick={() => onBook(doctor)} 
        className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book Appointment
      </Button>
    </div>
  );
}
