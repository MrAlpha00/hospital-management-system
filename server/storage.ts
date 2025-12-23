import { db } from "./db";
import {
  users, doctors, appointments, reports,
  type User, type InsertUser,
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type Report, type InsertReport
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Appointments
  getAppointments(): Promise<(Appointment & { doctor: Doctor, patient: User })[]>;
  getAppointmentsByPatient(patientId: number): Promise<(Appointment & { doctor: Doctor })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;

  // Reports
  getReportsByPatient(patientId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  async getAppointments(): Promise<(Appointment & { doctor: Doctor, patient: User })[]> {
    const result = await db.select({
      appointment: appointments,
      doctor: doctors,
      patient: users,
    })
    .from(appointments)
    .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
    .innerJoin(users, eq(appointments.patientId, users.id))
    .orderBy(desc(appointments.date));
    
    return result.map(r => ({ ...r.appointment, doctor: r.doctor, patient: r.patient }));
  }

  async getAppointmentsByPatient(patientId: number): Promise<(Appointment & { doctor: Doctor })[]> {
    const result = await db.select({
      appointment: appointments,
      doctor: doctors,
    })
    .from(appointments)
    .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.date));

    return result.map(r => ({ ...r.appointment, doctor: r.doctor }));
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ status: status as any })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async getReportsByPatient(patientId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.patientId, patientId));
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(insertReport).returning();
    return report;
  }
}

export const storage = new DatabaseStorage();
