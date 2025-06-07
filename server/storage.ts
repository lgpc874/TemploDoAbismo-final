import { users, grimoires, courses, contacts, type User, type InsertUser, type Grimoire, type InsertGrimoire, type Course, type InsertCourse, type Contact, type InsertContact } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grimoires: Map<number, Grimoire>;
  private courses: Map<number, Course>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentGrimoireId: number;
  private currentCourseId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.grimoires = new Map();
    this.courses = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentGrimoireId = 1;
    this.currentCourseId = 1;
    this.currentContactId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample grimoires
    this.grimoires.set(1, {
      id: 1,
      title: "Fundamentos do Luciferianismo",
      description: "Textos introdutórios aos mistérios ancestrais",
      type: "free",
      price: null,
      content: "Conteúdo introdutório..."
    });

    this.grimoires.set(2, {
      id: 2,
      title: "Rituais de Evocação Avançados",
      description: "Conhecimentos avançados do abismo",
      type: "premium",
      price: "97.00",
      content: "Conteúdo premium..."
    });

    this.grimoires.set(3, {
      id: 3,
      title: "Códices Medievais Restaurados",
      description: "Manuscritos raros recuperados",
      type: "lost",
      price: "147.00",
      content: "Manuscritos antigos..."
    });

    // Sample courses
    this.courses.set(1, {
      id: 1,
      title: "Iniciação Luciferiana",
      description: "Fundamentos e primeiros passos no caminho",
      price: "197.00",
      category: "Iniciação",
      level: "beginner"
    });

    this.courses.set(2, {
      id: 2,
      title: "Runas e Símbolos",
      description: "Interpretação e aplicação prática",
      price: "147.00",
      category: "Divinação",
      level: "intermediate"
    });

    this.courses.set(3, {
      id: 3,
      title: "Tarô Infernal",
      description: "Divinação através das cartas obscuras",
      price: "167.00",
      category: "Divinação",
      level: "intermediate"
    });

    this.courses.set(4, {
      id: 4,
      title: "Espelho Negro",
      description: "Scrying e visões através do abismo",
      price: "247.00",
      category: "Scrying",
      level: "advanced"
    });

    this.currentGrimoireId = 4;
    this.currentCourseId = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isVip: false,
      hasSecretAccess: false
    };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async getGrimoires(): Promise<Grimoire[]> {
    return Array.from(this.grimoires.values());
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createGrimoire(insertGrimoire: InsertGrimoire): Promise<Grimoire> {
    const id = this.currentGrimoireId++;
    const grimoire: Grimoire = { 
      id,
      title: insertGrimoire.title,
      description: insertGrimoire.description,
      type: insertGrimoire.type,
      content: insertGrimoire.content ?? null,
      price: insertGrimoire.price ?? null
    };
    this.grimoires.set(id, grimoire);
    return grimoire;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }
}

export const storage = new MemStorage();
