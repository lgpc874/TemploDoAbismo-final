import { users, grimoires, courses, contacts, type User, type InsertUser, type Grimoire, type InsertGrimoire, type Course, type InsertCourse, type Contact, type InsertContact } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getGrimoires(): Promise<Grimoire[]>;
  getCourses(): Promise<Course[]>;
  createGrimoire(grimoire: InsertGrimoire): Promise<Grimoire>;
  createCourse(course: InsertCourse): Promise<Course>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getGrimoires(): Promise<Grimoire[]> {
    return await db.select().from(grimoires);
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async createGrimoire(insertGrimoire: InsertGrimoire): Promise<Grimoire> {
    const [grimoire] = await db
      .insert(grimoires)
      .values(insertGrimoire)
      .returning();
    return grimoire;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }
}

export const storage = new DatabaseStorage();
