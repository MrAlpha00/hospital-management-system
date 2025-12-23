import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);
  registerObjectStorageRoutes(app);

  // Doctors
  app.get(api.doctors.list.path, async (_req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) return res.sendStatus(404);
    res.json(doctor);
  });

  app.post(api.doctors.create.path, async (req, res) => {
    // Check if user is admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(401);
    const parsed = api.doctors.create.input.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const doctor = await storage.createDoctor(parsed.data);
    res.status(201).json(doctor);
  });

  // Appointments
  app.get(api.appointments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role === 'admin') {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } else {
      const appointments = await storage.getAppointmentsByPatient(req.user.id);
      res.json(appointments);
    }
  });

  app.post(api.appointments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = api.appointments.create.input.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    
    // Force patientId to be current user if not admin
    // If admin is creating, they should specify patientId, but for now let's assume patient creates their own
    // Or admin creates for patient.
    let patientId = req.user.id;
    if (req.user.role === 'admin' && parsed.data.patientId) {
        patientId = parsed.data.patientId;
    }
    
    const data = { ...parsed.data, patientId };
    const appointment = await storage.createAppointment(data);
    res.status(201).json(appointment);
  });

  app.patch(api.appointments.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(401);
    const parsed = api.appointments.updateStatus.input.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const updated = await storage.updateAppointmentStatus(Number(req.params.id), parsed.data.status);
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  });

  // Reports
  app.get(api.reports.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const reports = await storage.getReportsByPatient(req.user.id);
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(401);
    const parsed = api.reports.create.input.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const report = await storage.createReport(parsed.data);
    res.status(201).json(report);
  });

  // Seed data on startup
  seed();

  return httpServer;
}

async function seed() {
  const existingDoctors = await storage.getDoctors();
  if (existingDoctors.length === 0) {
    await storage.createDoctor({
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      bio: "Expert cardiologist with 15 years experience.",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80",
      availability: "Mon-Fri 09:00-17:00",
      experience: 15,
      rating: "4.9"
    });
    await storage.createDoctor({
      name: "Dr. Michael Chen",
      specialization: "Pediatrics",
      bio: "Friendly pediatrician loved by kids.",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80",
      availability: "Mon-Wed, Fri 10:00-16:00",
      experience: 10,
      rating: "4.8"
    });
    await storage.createDoctor({
      name: "Dr. Emily Wilson",
      specialization: "Neurology",
      bio: "Specializing in neurological disorders.",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80",
      availability: "Tue-Thu 08:00-14:00",
      experience: 12,
      rating: "4.9"
    });
  }
}
