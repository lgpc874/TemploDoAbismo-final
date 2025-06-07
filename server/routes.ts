import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Erro ao enviar mensagem" });
    }
  });

  // Get grimoires
  app.get("/api/grimoires", async (req, res) => {
    try {
      const grimoires = await storage.getGrimoires();
      res.json(grimoires);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar grimórios" });
    }
  });

  // Get courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cursos" });
    }
  });

  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
