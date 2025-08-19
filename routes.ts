import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecordingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recordings
  app.get("/api/recordings", async (req, res) => {
    try {
      const recordings = await storage.getAllRecordings();
      res.json(recordings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  // Get a specific recording
  app.get("/api/recordings/:id", async (req, res) => {
    try {
      const recording = await storage.getRecording(req.params.id);
      if (!recording) {
        return res.status(404).json({ message: "Recording not found" });
      }
      res.json(recording);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recording" });
    }
  });

  // Create a new recording
  app.post("/api/recordings", async (req, res) => {
    try {
      const validatedData = insertRecordingSchema.parse(req.body);
      const recording = await storage.createRecording(validatedData);
      res.status(201).json(recording);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recording data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recording" });
    }
  });

  // Delete a recording
  app.delete("/api/recordings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRecording(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Recording not found" });
      }
      res.json({ message: "Recording deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recording" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
