import { type User, type InsertUser, type Recording, type InsertRecording } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recording operations
  getRecording(id: string): Promise<Recording | undefined>;
  getAllRecordings(): Promise<Recording[]>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  deleteRecording(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recordings: Map<string, Recording>;

  constructor() {
    this.users = new Map();
    this.recordings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRecording(id: string): Promise<Recording | undefined> {
    return this.recordings.get(id);
  }

  async getAllRecordings(): Promise<Recording[]> {
    return Array.from(this.recordings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createRecording(insertRecording: InsertRecording): Promise<Recording> {
    const id = randomUUID();
    const recording: Recording = {
      ...insertRecording,
      id,
      createdAt: new Date(),
      hasAudio: insertRecording.hasAudio ?? false,
      hasMicrophone: insertRecording.hasMicrophone ?? false,
    };
    this.recordings.set(id, recording);
    return recording;
  }

  async deleteRecording(id: string): Promise<boolean> {
    return this.recordings.delete(id);
  }
}

export const storage = new MemStorage();
